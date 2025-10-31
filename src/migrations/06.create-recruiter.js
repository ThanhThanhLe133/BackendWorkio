'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Recruiters', {
    recruiter_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      allowNull: false,
      primaryKey: true,
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: ""
    },
    tax_number: {
      type: Sequelize.STRING(50),
      allowNull: true,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    website: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    established_at: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
    status: {
      type: Sequelize.ENUM(
        'Chưa xác minh',       // Not Verified
        'Đang xem xét',        // Under Review
        'Đã xác minh',         // Verified
        'Bị từ chối'           // Rejected
      ),
      allowNull: true,
      defaultValue: 'Chưa xác minh',
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
    `ALTER TABLE "Recruiters" DISABLE ROW LEVEL SECURITY;`
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Recruiters_status";');
  await queryInterface.dropTable('Recruiters');
}
