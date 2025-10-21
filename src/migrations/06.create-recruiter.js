'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Recruiters', {
    recruiter_id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    tax_number: {
      type: Sequelize.STRING(50),
      allowNull: true,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    website: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    established_at: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    address_id: {
      type: Sequelize.UUID,
      allowNull: true,
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
    `ALTER TABLE "Recruiters" ENABLE ROW LEVEL SECURITY;`
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Recruiters');
}
