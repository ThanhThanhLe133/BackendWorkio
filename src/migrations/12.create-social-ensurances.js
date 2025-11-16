"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SocialInsurances', {
            insurance_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()')
            },
            identify_number: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Candidates',
                    key: 'identify_number'
                },
                onDelete: 'CASCADE'
            },
            insurance_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            company_name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            salary_base: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
            },
            note: {
                type: Sequelize.STRING,
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('SocialInsurances');
    }
};
