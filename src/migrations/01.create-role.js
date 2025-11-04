"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false,
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
        `ALTER TABLE "Roles" DISABLE ROW LEVEL SECURITY;`
    );
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
}
