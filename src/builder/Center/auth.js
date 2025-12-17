import { CenterRepository, UserRepository } from "../../repository/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class CenterAuthBuilder {
    constructor() {
        this.centerRepo = new CenterRepository();
        this.userRepo = new UserRepository();
        this.email = null;
        this.password = null;
        this.role = "Center";
    }

    setEmail(email) { this.email = email; return this; }
    setPassword(password) { this.password = password; return this; }

    async loginCenter() {
        if (!this.email || !this.password) throw new Error("Missing email or password");

        const user = await this.centerRepo.getByEmail(this.email);
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
            { expiresIn: "1h" }
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
}

