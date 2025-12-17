import db from "../models/index.js";

class CenterRepository {
    async getByEmail(email) {
        return db.User.findOne({
            where: { email },
            include: [
                {
                    model: db.Center,
                    as: "center",
                },
                {
                    model: db.Role,
                    as: "role",
                    where: { value: "Center" },
                },
            ],
        });
    }

    async getByRefreshToken(refresh_token) {
        return db.User.findOne({
            where: { refresh_token },
            include: [
                {
                    model: db.Center,
                    as: "center",
                },
                {
                    model: db.Role,
                    as: "role",
                    where: { value: "Center" },
                },
            ],
        });
    }

    async getById(user_id) {
        return db.User.findOne({
            where: { id: user_id },
            include: [
                {
                    model: db.Center,
                    as: "center",
                },
                {
                    model: db.Role,
                    as: "role",
                    where: { value: "Center" },
                },
            ],
        });
    }

    async getRole(value = "Center") {
        return db.Role.findOne({ where: { value } });
    }
}

export { CenterRepository };

