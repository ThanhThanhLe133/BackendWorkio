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

    async getAll() {
        return db.Center.findAll({
            include: [
                {
                    model: db.User,
                    as: 'center',
                    attributes: ['id', 'email', 'name', 'avatar_url', 'role_id']
                },
                {
                    model: db.Address,
                    as: 'address',
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

    async getCenterById(center_id) {
        return db.Center.findOne({
            where: { center_id },
            include: [
                {
                    model: db.User,
                    as: 'center',
                },
                {
                    model: db.Address,
                    as: 'address',
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

    async createCenter(data, transaction = null) {
        return db.Center.create(data, { transaction });
    }
}

export { CenterRepository };
