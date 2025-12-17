import db from "../models/index.js";

class SupportRequestRepository {
    async create({ title, description, priority, created_by }) {
        return db.SupportRequest.create({
            title,
            description,
            priority,
            created_by,
        });
    }

    async getAll() {
        return db.SupportRequest.findAll({
            include: [
                {
                    model: db.User,
                    as: "creator",
                    attributes: ["id", "email", "name", "avatar_url"],
                    include: [
                        {
                            model: db.Role,
                            as: "role",
                            attributes: ["value"],
                        },
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });
    }

    async getByCreator(userId) {
        return db.SupportRequest.findAll({
            where: { created_by: userId },
            order: [["created_at", "DESC"]],
        });
    }

    async update(id, payload) {
        const [rowsUpdated, [updated]] = await db.SupportRequest.update(payload, {
            where: { id },
            returning: true,
        });
        return rowsUpdated ? updated : null;
    }

    async delete(id) {
        return db.SupportRequest.destroy({ where: { id } });
    }
}

export { SupportRequestRepository };

