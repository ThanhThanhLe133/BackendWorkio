'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("StudyHistories", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                allowNull: false,
                primaryKey: true
            },
            candidate_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            school_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            degree: {
                type: Sequelize.STRING,
                allowNull: true
            },
            field_of_study: {
                type: Sequelize.STRING,
                allowNull: true
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
        });

        await queryInterface.sequelize.query(`
      ALTER TABLE "StudyHistories" DISABLE ROW LEVEL SECURITY;
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("StudyHistories");
    },
};
