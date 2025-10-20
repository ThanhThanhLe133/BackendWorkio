'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Candidates', {
        candidate_id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
        },
        resume_url: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        experience_years: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        skills: {
            type: Sequelize.JSONB,
            allowNull: true,
        },
        gender: {
            type: Sequelize.ENUM('Male', 'Female', 'Other'),
            allowNull: true,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        dob: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        is_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    await queryInterface.sequelize.query(
        `ALTER TABLE "Candidates" ENABLE ROW LEVEL SECURITY;`
    );
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Candidates');
}
