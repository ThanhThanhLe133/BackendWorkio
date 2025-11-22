'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CourseEnrollments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'TrainingCourses',
          key: 'id',
        },
      },
      candidate_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Candidates',
          key: 'candidate_id',
        },
      },
      assigned_by_admin_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Admins',
          key: 'admin_id',
        },
      },
      enrollment_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Đang học',
      },
      result_score: {
        type: Sequelize.DECIMAL,
      },
      notes: {
        type: Sequelize.TEXT,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CourseEnrollments');
  },
};
