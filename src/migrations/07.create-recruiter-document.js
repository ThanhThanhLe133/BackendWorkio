'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('RecruiterDocuments', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
    recruiter_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Recruiters',
        key: 'recruiter_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    type: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'Loại giấy tờ, ví dụ: Giấy phép kinh doanh, Chứng nhận ISO…',
    },
    number: {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Số giấy tờ hoặc mã định danh',
    },
    issue_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    expire_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    file_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'URL file giấy tờ',
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
  await queryInterface.sequelize.query(
    `ALTER TABLE "RecruiterDocuments" ENABLE ROW LEVEL SECURITY;`
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('RecruiterDocuments');
}
