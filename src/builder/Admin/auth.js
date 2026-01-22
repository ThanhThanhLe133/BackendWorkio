import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AdminRepository, UserRepository } from "../../repository/index.js";
import { sendResetPasswordEmail } from "../../helpers/email.js";
import db from "../../models/index.js";
import { hashPassword } from "../../helpers/fn.js";

dotenv.config();

export class AdminAuthBuilder {
    constructor() {
        this.adminRepo = new AdminRepository();
        this.userRepo = new UserRepository();
        this.email = null;
        this.password = null;
        this.newPassword = null;
        this.token = null;
        this.refresh_token = null;
        this.user_id = null;
        this.name = null;
        this.role = "Admin";
    }

    setEmail(email) { this.email = email; return this; }
    setName(name) { this.name = name; return this; }
    setPassword(password) { this.password = password; return this; }
    setNewPassword(password) { this.newPassword = password; return this; }
    setToken(token) { this.token = token; return this; }
    setRefreshToken(token) { this.refresh_token = token; return this; }
    setUserId(id) { this.user_id = id; return this; }
    setRole(role) { this.role = role; return this; }

    async loginAdmin() {
        if (!this.email || !this.password)
            throw new Error("Missing email or password");

        const user = await this.adminRepo.findByEmail(this.email);
        if (!user)
            throw new Error("Không tìm thấy Admin");
        if (!user.admin)
            throw new Error("Không tìm thấy thông tin Admin");

        const isMatch = bcrypt.compareSync(this.password, user.password);
        if (!isMatch)
            return { err: 1, mes: "Sai mật khẩu" };

        const access_token = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const refresh_token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: "7d" }
        );

        await this.userRepo.updateUser(user.id, { refresh_token });

        return {
            err: 0,
            mes: "Đăng nhập thành công",
            access_token: `Bearer ${access_token}`,
            refresh_token,
            data: user,
        };
    }

    async refreshToken() {
        if (!this.refresh_token)
            throw new Error("Missing refresh token");

        const user = await this.adminRepo.findByRefreshToken(this.refresh_token);
        if (!user)
            throw new Error("Refresh Token hết hạn hoặc không hợp lệ");

        try {
            jwt.verify(this.refresh_token, process.env.JWT_SECRET_REFRESH);
        } catch {
            return { err: 1, mes: "Refresh token expired. Require login again." };
        }

        const new_access_token = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return {
            err: 0,
            mes: "Làm mới token thành công",
            access_token: `Bearer ${new_access_token}`
        };
    }

    async forgotPasswordAdmin() {
        if (!this.email) throw new Error("Missing email");

        const user = await this.adminRepo.findByEmail(this.email);
        if (!user) throw new Error("Không tìm thấy Admin với email này");

        const token = jwt.sign(
            { email: this.email },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: "1d" }
        );

        await sendResetPasswordEmail(this.email, token, this.role);

        return {
            err: 0,
            mes: "Đã gửi liên kết đặt lại mật khẩu tới email của bạn",
        };
    }

    async verifyResetToken() {
        if (!this.token) throw new Error("Missing token");

        const decoded = jwt.verify(this.token, process.env.RESET_PASSWORD_SECRET);
        const email = decoded.email;

        const user = await this.adminRepo.findByEmail(email);
        if (!user) throw new Error("Không tìm thấy Admin với email này");

        return { err: 0, mes: "Token hợp lệ", email };
    }

    async createNewPassword() {
        if (!this.email || !this.newPassword)
            throw new Error("Missing email or new password");

        const user = await this.adminRepo.findByEmail(this.email);
        if (!user) throw new Error("Không tìm thấy Admin với email này");

        const hashedPassword = hashPassword(this.newPassword);
        await this.userRepo.updateUser(
            user.id, {
            password: hashedPassword
        });

        return {
            err: 0,
            mes: "Đặt lại mật khẩu thành công",
            email: this.email,
        };
    }

    async createAccountAdmin() {
        if (!this.email || !this.password)
            throw new Error("Missing email or password");

        const user = await this.adminRepo.findByEmail(this.email);
        if (user) throw new Error("Email đã tồn tại với admin này");
        const role = await this.adminRepo.findRole();
        if (!role) throw new Error("Không tìm thấy role Admin");

        this.user = await this.userRepo.createUser({
            email: this.email,
            password: hashPassword(this.password),
            name: this.name,
            role_id: role.id
        });
        this.admin = await this.adminRepo.createAdmin({
            admin_id: this.user.id
        });
        return {
            err: 0,
            mes: "Tạo admin thành công",
        };
    }

    async logout() {
        if (!this.user_id) throw new Error("Missing user id");

        const user = await this.adminRepo.findById(this.user_id);
        if (!user) throw new Error("Không tìm thấy Admin");

        await this.userRepo.updateUser
            (user.id, {
                refresh_token: null
            });

        return {
            err: 0,
            mes: "Đăng xuất thành công",
            access_token: null,
            refresh_token: null,
        };
    }
}
