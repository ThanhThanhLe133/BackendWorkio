import db from "../models/index.js";
import { Op } from "sequelize";

class RecruiterRepository {
    buildOrder(sort_by, order) {
        const direction = String(order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const map = {
            company_name: ['company_name', direction],
            created_at: ['created_at', direction],
            updated_at: ['updated_at', direction],
        };
        return [map[sort_by] || ['created_at', 'DESC']];
    }

    async attachHiredCount(recruiters = []) {
        if (!recruiters.length) return [];

        const recruiterIds = recruiters.map((r) => r.recruiter_id);
        const counts = await db.JobPost.findAll({
            attributes: ['recruiter_id', [db.Sequelize.fn('COUNT', db.Sequelize.col('recruiter_id')), 'count']],
            where: { recruiter_id: recruiterIds, status: 'Đã tuyển' },
            group: ['recruiter_id'],
            raw: true,
        });
        const countMap = counts.reduce((acc, row) => {
            acc[row.recruiter_id] = Number(row.count) || 0;
            return acc;
        }, {});

        return recruiters.map((recruiter) => {
            const json = recruiter.toJSON();
            json.hired_count = countMap[recruiter.recruiter_id] ?? 0;
            return json;
        });
    }

    async getAll(filters = {}) {
        const { search, is_verified, sort_by, order, fields } = filters;
        const where = {};
        if (search) {
            const keyword = `%${search}%`;
            where[Op.or] = [
                { company_name: { [Op.iLike]: keyword } },
                { email: { [Op.iLike]: keyword } },
                { phone: { [Op.iLike]: keyword } },
            ];
        }
        if (is_verified !== undefined) where.is_verified = is_verified === 'true' || is_verified === true;
        if (fields) {
            const list = Array.isArray(fields)
                ? fields
                : String(fields).split(',').map((f) => f.trim()).filter(Boolean);
            if (list.length) {
                const orClauses = list
                    .map((f) => {
                        const raw = f.replace(/'/g, "''");
                        return `(fields @> '${JSON.stringify([raw])}'::jsonb OR fields @> '[{"industry": ["${raw}"]}]'::jsonb)`;
                    })
                    .join(' OR ');
                where.recruiter_id = {
                    [Op.in]: db.Sequelize.literal(`(SELECT recruiter_id FROM "JobPosts" WHERE ${orClauses})`),
                };
            }
        }

        const recruiters = await db.Recruiter.findAll({
            where,
            include:
            {
                model: db.User,
                as: 'recruiter',
            },
            order: this.buildOrder(sort_by, order),
        });
        return this.attachHiredCount(recruiters);
    }

    async getByEmail(email) {
        return db.User.findOne({
            where: { email },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Recruiter' },
                },
            ],
        });
    }

    async getByRefreshToken(refresh_token) {
        return db.User.findOne({
            where: { refresh_token },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Recruiter' },
                },
            ],
        });
    }

    async getById(user_id) {
        return db.User.findOne({
            where: { id: user_id },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Recruiter' },
                },
            ],
        });
    }

    async getRole(value = 'Admin') {
        return db.Role.findOne({ where: { value } });
    }

    async createRecruiter(recruiterData) {
        return db.Recruiter.create(recruiterData);
    }
    async updateRecruiter(recruiter_id, updateData) {
        return db.Recruiter.update(updateData, {
            where: { recruiter_id },
            returning: true,
        });
    }

    async deleteRecruiter(recruiter_id) {
        return db.Recruiter.destroy({ where: { recruiter_id } });
    }

    async getDetailById(recruiter_id) {
        const recruiter = await db.Recruiter.findOne({
            where: { recruiter_id },
            include: [
                {
                    model: db.User,
                    as: 'recruiter',
                    attributes: ['id', 'email', 'name', 'avatar_url', 'role_id']
                },
                {
                    model: db.Address,
                    as: 'address',
                },
            ],
        });
        if (!recruiter) return null;
        const hired_count = await db.JobPost.count({
            where: { recruiter_id, status: 'Đã tuyển' },
        });
        const json = recruiter.toJSON();
        json.hired_count = hired_count;
        return json;
    }

    async updateRecruiterProfile(user_id, payload) {
        const transaction = await db.sequelize.transaction();
        try {
            const { recruiterInfo, addressInfo } = payload;

            const recruiter = await db.Recruiter.findOne({ where: { recruiter_id: user_id } });
            if (!recruiter) {
                throw new Error("Recruiter not found");
            }

            // Update Recruiter
            if (recruiterInfo) {
                await db.Recruiter.update(recruiterInfo, {
                    where: { recruiter_id: user_id },
                    transaction
                });
            }

            // Update Address
            if (addressInfo) {
                if (recruiter.address_id) {
                    await db.Address.update(addressInfo, {
                        where: { id: recruiter.address_id },
                        transaction
                    });
                } else {
                    const newAddress = await db.Address.create(addressInfo, { transaction });
                    await db.Recruiter.update({ address_id: newAddress.id }, {
                        where: { recruiter_id: user_id },
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

export { RecruiterRepository };
