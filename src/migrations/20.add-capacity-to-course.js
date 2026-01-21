'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Courses', 'capacity', {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: 'Sĩ số tối đa của khóa học',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Courses', 'capacity');
    },
};
