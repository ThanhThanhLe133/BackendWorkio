"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("WorkExperiences", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                allowNull: false,
                primaryKey: true,
            },
            candidate_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            company_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            position: {
                type: Sequelize.STRING,
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
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });

        await queryInterface.sequelize.query(`
      ALTER TABLE "WorkExperiences" DISABLE ROW LEVEL SECURITY;
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("WorkExperiences");
    },
};
