import db from "../models/index.js";

class AdminRepository {
    async findByEmail(email) {
        return db.User.findOne({
            where: { email },
            include: [
                {
                    model: db.Admin,
                    as: 'admin',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Admin' },
                },
            ],
        });
    }

    async findByRefreshToken(refresh_token) {
        return db.User.findOne({
            where: { refresh_token },
            include: [
                {
                    model: db.Admin,
                    as: 'admin',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Admin' },
                },
            ],
        });
    }

    async findById(user_id) {
        return db.User.findOne({
            where: { id: user_id },
            include: [
                {
                    model: db.Admin,
                    as: 'admin',
                },
                {
                    model: db.Role,
                    as: 'role',
                    attributes: ['value'],
                },
            ],
        });
    }

    async findRole(value = 'Admin') {
        return db.Role.findOne({ where: { value } });
    }

    async createAdmin(adminData) {
        return db.Admin.create(adminData);
    }

    async updateAdmin(admin_id, updateData) {
        return db.Admin.update(updateData, {
            where: { admin_id },
            returning: true,
        });
    }

    async deleteAdmin(admin_id) {
        return db.Admin.destroy({ where: { admin_id } });
    }
}

export { AdminRepository };
