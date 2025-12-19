'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Courses', 'training_field', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Courses', 'occupation_type', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Courses', 'summary', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.addColumn('Courses', 'details', {
            type: Sequelize.JSONB,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Courses', 'training_field');
        await queryInterface.removeColumn('Courses', 'occupation_type');
        await queryInterface.removeColumn('Courses', 'summary');
        await queryInterface.removeColumn('Courses', 'details');
    },
};
