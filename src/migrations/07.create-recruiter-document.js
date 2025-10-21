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
      type: Sequelize.ENUM("Business License", "ISO Certificate", "Other"),
      allowNull: false,
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
