'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Fields', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: Sequelize.ENUM(
        "CNTT",           // IT
        "Tài chính",      // Finance
        "Marketing",
        "Thiết kế",       // Design
        "Bán hàng",       // Sales
        "Nhân sự",        // HR
        "Vận hành",       // Operations
        "Hỗ trợ",         // Support
        "Pháp lý",        // Legal
        "Nghiên cứu & Phát triển", // R&D
        "Khác"            // Other
      ),
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
    `ALTER TABLE "Fields" DISABLE ROW LEVEL SECURITY;`
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Fields_value";');
  await queryInterface.dropTable('Fields');
}
