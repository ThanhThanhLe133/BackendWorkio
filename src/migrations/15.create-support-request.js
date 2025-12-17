"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("SupportRequests", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal("gen_random_uuid()"),
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            priority: {
                type: Sequelize.ENUM("low", "medium", "high"),
                allowNull: false,
                defaultValue: "medium",
            },
            status: {
                type: Sequelize.ENUM("open", "in_progress", "resolved"),
                allowNull: false,
                defaultValue: "open",
            },
            created_by: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("NOW()"),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("NOW()"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("SupportRequests");
        // Best-effort cleanup for enum types in Postgres
        try {
            await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_SupportRequests_priority";');
            await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_SupportRequests_status";');
        } catch {
            // ignore
        }
    },
};

