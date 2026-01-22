import { RecruiterRepository, UserRepository } from "../../repository/index.js";
import { hashPassword } from '../../helpers/fn.js';
import { sendResetPasswordEmail } from "../../helpers/email.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import db from "../../models/index.js";
dotenv.config();

export class RecruiterAuthBuilder {
    constructor() {
        this.recruiterRepo = new RecruiterRepository();
        this.userRepo = new UserRepository();
        this.email = null;
        this.password = null;
        this.newPassword = null;
        this.token = null;
        this.refresh_token = null;
        this.user_id = null;
        this.role = "Recruiter";
    }

    setEmail(email) { this.email = email; return this; }
    setPassword(password) { this.password = password; return this; }
    setNewPassword(password) { this.newPassword = password; return this; }
    setToken(token) { this.token = token; return this; }
    setRefreshToken(token) { this.refresh_token = token; return this; }
    setUserId(id) { this.user_id = id; return this; }
    setRole(role) { this.role = role; return this; }

    async verifiedCallBackrecruiter() {
        if (!this.token) throw new Error("Missing token");

        const decoded = jwt.verify(this.token, process.env.EMAIL_VERIFY_SECRET);
        const email = decoded.email;
        if (!email) throw new Error("Invalid token payload");

        const user = await this.recruiterRepo.getByEmail(email);
        if (!user)
            throw new Error(`Không tìm thấy thông tin nhà tuyển dụng`);
        if (!user.recruiter)
            throw new Error("Không tìm thấy thông tin nhà tuyển dụng");

        if (user.recruiter.is_verified) {
            return {
                err: 0,
                mes: "Email đã được xác minh trước đó", user
            };
        }

        await this.recruiterRepo.updateRecruiter(
            user.recruiter.recruiter_id, {
            is_verified: true
        });
        return { err: 0, mes: "Xác minh email thành công", user };
    }

    async loginRecruiter() {
        if (!this.email || !this.password) throw new Error("Missing email or password");

        const user = await this.recruiterRepo.getByEmail(this.email);
        if (!user)
            throw new Error(`Không tìm thấy thông tin nhà tuyển dụng`);
        if (!user.recruiter)
            throw new Error("Không tìm thấy thông tin nhà tuyển dụng");
        if (!user.recruiter.is_verified) {
            return {
                err: 1,
                mes: "Vui lòng xác thực email trước khi đăng nhập"
            };
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

        await this.userRepo.updateUser(
            user.id, {
            refresh_token
        });

        return {
            err: 0,
            mes: "Đăng nhập thành công",
            access_token: `Bearer ${access_token}`,
            refresh_token,
            data: user,
        };
    }

    async refreshToken() {
        if (!this.refresh_token) throw new Error("Missing refresh token");

        const transaction = await db.sequelize.transaction();

        try {
            const user = await this.userRepo.getByRefreshToken(this.refresh_token, transaction);
            if (!user) throw new Error("Refresh Token hết hạn hoặc không hợp lệ");

            jwt.verify(this.refresh_token, process.env.JWT_SECRET_REFRESH);

            const new_access_token = jwt.sign(
                { id: user.id, email: user.email, role_id: user.role_id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            await transaction.commit();

            return {
                err: 0,
                mes: "Làm mới token thành công",
                access_token: `Bearer ${new_access_token}`,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async forgotPasswordRecruiter() {
        if (!this.email) throw new Error("Missing email");

        const user = await this.recruiterRepo.getByEmail(this.email);
        if (!user)
            throw new Error("Không tìm thấy nhà tuyển dụng với email này");
        if (!user.recruiter)
            throw new Error("Không tìm thấy thông tin nhà tuyển dụng");
        if (!user.recruiter.is_verified) {
            return { err: 1, mes: "Vui lòng xác thực email trước" };
        }

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

    async resetPasswordRecruiter() {
        if (!this.token)
            throw new Error("Missing token");

        const decoded = jwt.verify(this.token, process.env.RESET_PASSWORD_SECRET);
        const email = decoded.email;

        const user = await this.recruiterRepo.getByEmail(email);
        if (!user)
            throw new Error("Không tìm thấy nhà tuyển dụng với email này");

        return { err: 0, mes: "Token hợp lệ", email };
    }

    async createNewPassword() {
        if (!this.email || !this.newPassword) throw new Error("Missing email or new password");

        const user = await this.recruiterRepo.getByEmail(this.email);
        if (!user)
            throw new Error("Không tìm thấy nhà tuyển dụng với email này");

        const hashedPassword = hashPassword(this.newPassword);
        await this.userRepo.updateUser(
            user.id, {
            password: hashedPassword
        });

        return {
            err: 0,
            mes: "Đặt lại mật khẩu thành công", email: this.email
        };
    }

    async logout() {
        if (!this.user_id)
            throw new Error("Missing user id");

        const user = await this.recruiterRepo.getById(this.user_id);
        if (!user)
            throw new Error("Không tìm thấy nhà tuyển dụng với email này");

        await this.userRepo.updateUser(user.id, { refresh_token: null });

        return {
            err: 0,
            mes: "Đăng xuất thành công",
            access_token: null,
            refresh_token: null,
        };
    }
}
