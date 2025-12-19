import db from "../models/index.js";
import { Op } from "sequelize";

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

    buildOrder(sort_by, order) {
        const direction = String(order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const map = {
            name: ['name', direction],
            created_at: ['created_at', direction],
            updated_at: ['updated_at', direction],
        };
        return [map[sort_by] || ['created_at', 'DESC']];
    }

    async getAll(filters = {}) {
        const { search, is_active, sort_by, order } = filters;
        const where = {};
        if (search) {
            const keyword = `%${search}%`;
            where[Op.or] = [
                { name: { [Op.iLike]: keyword } },
                { email: { [Op.iLike]: keyword } },
                { phone: { [Op.iLike]: keyword } },
            ];
        }
        if (is_active !== undefined) where.is_active = is_active === 'true' || is_active === true;

        return db.Center.findAll({
            where,
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
            order: this.buildOrder(sort_by, order),
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
