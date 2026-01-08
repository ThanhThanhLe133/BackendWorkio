'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Candidates', 'cv_profile', {
            type: Sequelize.JSONB,
            allowNull: true,
        });
        await queryInterface.addColumn('Candidates', 'cv_uploaded_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.addColumn('Candidates', 'matching_vector', {
            type: Sequelize.JSONB,
            allowNull: true,
        });

        await queryInterface.addColumn('StudyHistories', 'degree_level', {
            type: Sequelize.ENUM(
                'Primary',
                'Secondary',
                'HighSchool',
                'Vocational',
                'Associate',
                'Bachelor',
                'Master',
                'Doctorate',
                'Certificate',
                'Custom'
            ),
            allowNull: true,
        });
        await queryInterface.addColumn('StudyHistories', 'custom_degree_title', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Candidates', 'cv_profile');
        await queryInterface.removeColumn('Candidates', 'cv_uploaded_at');
        await queryInterface.removeColumn('Candidates', 'matching_vector');

        await queryInterface.removeColumn('StudyHistories', 'degree_level');
        await queryInterface.removeColumn('StudyHistories', 'custom_degree_title');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_StudyHistories_degree_level";');
    },
};
