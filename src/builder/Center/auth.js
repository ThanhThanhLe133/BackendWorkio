import { CenterRepository, UserRepository } from "../../repository/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendResetPasswordEmail } from "../../helpers/email.js";
import { hashPassword } from "../../helpers/fn.js";
dotenv.config();

export class CenterAuthBuilder {
    constructor() {
        this.centerRepo = new CenterRepository();
        this.userRepo = new UserRepository();
        this.email = null;
        this.password = null;
        this.newPassword = null;
        this.token = null;
        this.refresh_token = null;
        this.user_id = null;
        this.role = "Center";
    }

    setEmail(email) { this.email = email; return this; }
    setPassword(password) { this.password = password; return this; }
    setNewPassword(password) { this.newPassword = password; return this; }
    setToken(token) { this.token = token; return this; }
    setRefreshToken(token) { this.refresh_token = token; return this; }
    setUserId(id) { this.user_id = id; return this; }

    async loginCenter() {
        if (!this.email || !this.password) throw new Error("Missing email or password");

        const user = await this.centerRepo.getByEmail(this.email);
        console.log("User found:", user ? "Yes" : "No");
        if (user) {
            console.log("User has center:", user.center ? "Yes" : "No");
            console.log("User role:", user.role?.value);
        }

        if (!user) throw new Error("Không tìm thấy thông tin trung tâm");
        if (!user.center) throw new Error("Không tìm thấy thông tin trung tâm");
        if (user.center.is_active === false) {
            return { err: 1, mes: "Tài khoản trung tâm đang bị khóa" };
        }

        const isMatch = bcrypt.compareSync(this.password, user.password);
        if (!isMatch) return { err: 1, mes: "Sai mật khẩu" };

        const access_token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_id },
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

    async forgotPasswordCenter() {
        if (!this.email) throw new Error("Missing email");

        const user = await this.centerRepo.getByEmail(this.email);
        if (!user) throw new Error("Không tìm thấy Trung tâm với email này");

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

    async resetPasswordCenter() {
        if (!this.token || !this.newPassword)
            throw new Error("Missing token or password");

        const decoded = jwt.verify(this.token, process.env.RESET_PASSWORD_SECRET);
        const email = decoded.email;

        const user = await this.centerRepo.getByEmail(email);
        if (!user) throw new Error("Không tìm thấy Trung tâm với email này");

        const hashedPassword = hashPassword(this.newPassword);
        await this.userRepo.updateUser(user.id, { password: hashedPassword });

        return {
            err: 0,
            mes: "Đặt lại mật khẩu thành công",
        };
    }

    async createNewPassword() {
        if (!this.email || !this.newPassword)
            throw new Error("Missing email or new password");

        const user = await this.centerRepo.getByEmail(this.email);
        if (!user) throw new Error("Không tìm thấy Trung tâm với email này");

        const hashedPassword = hashPassword(this.newPassword);
        await this.userRepo.updateUser(user.id, { password: hashedPassword });

        return {
            err: 0,
            mes: "Đặt lại mật khẩu thành công",
            email: this.email,
        };
    }

    async refreshToken() {
        if (!this.refresh_token)
            throw new Error("Missing refresh token");

        const user = await this.centerRepo.findByRefreshToken(this.refresh_token);
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

    async logout() {
        if (!this.user_id) throw new Error("Missing user id");

        const user = await this.centerRepo.getById(this.user_id);
        if (!user) throw new Error("Không tìm thấy Trung tâm");

        await this.userRepo.updateUser(user.id, { refresh_token: null });

        return {
            err: 0,
            mes: "Đăng xuất thành công",
            access_token: null,
            refresh_token: null,
        };
    }
}

