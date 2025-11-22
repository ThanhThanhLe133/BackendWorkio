"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Courses", {
            course_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal("uuid_generate_v4()"),
                allowNull: false,
                primaryKey: true,
            },
            center_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Centers",
                    key: "center_id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            duration_hours: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            candidates: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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
        await queryInterface.dropTable("Courses");
    },
};
