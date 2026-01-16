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
        const {
            search,
            is_active,
            province_code,
            ward_code,
            sort_by,
            order,
            training_field,
        } = filters;
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
        const addressInclude = {
            model: db.Address,
            as: 'address',
        };
        if (province_code || ward_code) {
            addressInclude.where = {};
            if (province_code) addressInclude.where.province_code = province_code;
            if (ward_code) addressInclude.where.ward_code = ward_code;
        }

        const include = [
            {
                model: db.User,
                as: 'center',
                attributes: ['id', 'email', 'name', 'avatar_url', 'role_id']
            },
            addressInclude,
        ];

        if (training_field) {
            const rawValues = Array.isArray(training_field)
                ? training_field
                : String(training_field)
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean);

            if (rawValues.length > 0) {
                include.push({
                    model: db.Course,
                    as: 'courses',
                    attributes: [],
                    required: true,
                    where: rawValues.length > 1
                        ? { training_field: { [Op.in]: rawValues } }
                        : { training_field: rawValues[0] },
                });
            }
        }

        return db.Center.findAll({
            where,
            include,
            order: this.buildOrder(sort_by, order),
            distinct: true,
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

    async updateCenterProfile(user_id, payload) {
        const transaction = await db.sequelize.transaction();
        try {
            const center = await db.Center.findOne({ where: { center_id: user_id } });
            if (!center) {
                throw new Error("Center not found");
            }

            // Extract center fields from payload
            const centerFields = {};
            const allowedFields = ['name', 'phone', 'email', 'website', 'description', 'code', 'is_active'];
            
            for (const field of allowedFields) {
                if (payload[field] !== undefined) {
                    centerFields[field] = payload[field];
                }
            }

            // Update Center if there are fields to update
            if (Object.keys(centerFields).length > 0) {
                await db.Center.update(centerFields, {
                    where: { center_id: user_id },
                    transaction
                });
            }

            // Handle addressInfo if provided (for future address updates)
            if (payload.addressInfo) {
                if (center.address_id) {
                    await db.Address.update(payload.addressInfo, {
                        where: { id: center.address_id },
                        transaction
                    });
                } else {
                    const newAddress = await db.Address.create(payload.addressInfo, { transaction });
                    await db.Center.update({ address_id: newAddress.id }, {
                        where: { center_id: user_id },
                        transaction
                    });
                }
            }

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export { CenterRepository };
