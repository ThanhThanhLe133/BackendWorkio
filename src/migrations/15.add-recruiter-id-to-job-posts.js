'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('JobPosts', 'recruiter_id', {
    type: Sequelize.UUID,
    allowNull: true,
    // Không có foreign key constraint - job post vẫn tồn tại khi recruiter bị xóa
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('JobPosts', 'recruiter_id');
}
