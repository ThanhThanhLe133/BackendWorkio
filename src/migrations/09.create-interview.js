'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Interviews", {
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
            job_post_id: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            scheduled_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            location: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            interview_type: {
                type: Sequelize.ENUM('Online', 'Offline'),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("Đang diễn ra", "Đã kết thúc"),
                defaultValue: 'Đang diễn ra',
                allowNull: false,
            },
            notes: {
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
      ALTER TABLE "Interviews" DISABLE ROW LEVEL SECURITY;
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Interviews");
    },
};
