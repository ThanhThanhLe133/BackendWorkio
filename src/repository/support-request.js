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
        const results = await db.SupportRequest.findAll({
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
            // Sequelize attribute is createdAt; with underscored: true the column is created_at
            order: [["createdAt", "DESC"]],
            raw: false, // Ensure toJSON hook is called
        });

        // Ensure timestamps are in the response
        return results.map(item => {
            const json = item.toJSON();
            // Expose snake_case timestamps expected by FE
            json.created_at = item.createdAt;
            json.updated_at = item.updatedAt;
            return json;
        });
    }

    async getByCreator(userId) {
        const results = await db.SupportRequest.findAll({
            where: { created_by: userId },
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
            order: [["createdAt", "DESC"]],
            raw: false, // Ensure toJSON hook is called
        });

        // Ensure timestamps are in the response
        return results.map(item => {
            const json = item.toJSON();
            json.created_at = item.createdAt;
            json.updated_at = item.updatedAt;
            return json;
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

