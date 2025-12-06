'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('JobPosts', 'recruiter_id', {
    type: Sequelize.UUID,
    allowNull: true,
    references: {
      model: 'Recruiters',
      key: 'recruiter_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('JobPosts', 'recruiter_id');
}
