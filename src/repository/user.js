import db from "../models/index.js";

class UserRepository {
    async getByEmail(email) {
        return db.User.findOne({
            where: { email },
        })
    }

    async getByRefreshToken(refresh_token) {
        return db.User.findOne({
            where: { refresh_token },
        })
    }

    async getById(user_id) {
        return db.User.findOne({
            where: { id: user_id },
        })
    }

    async getRole(value) {
        return db.Role.findOne({ where: { value } });
    }

    async createUser(userData, transaction = null) {
        return await db.User.create(userData, { transaction });
    }

    async updateUser(id, updateData) {
        return await db.User.update(updateData, {
            where: { id },
            returning: true,
        });
    }

    async deleteUser(id) {
        return await db.User.destroy({ where: { id } });
    }
}

export { UserRepository };
