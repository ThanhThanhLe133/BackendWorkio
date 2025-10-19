"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Users", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    refresh_token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:
        "https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png",
    },
    supabase_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
  await queryInterface.sequelize.query(
    `ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;`
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Users");
}
