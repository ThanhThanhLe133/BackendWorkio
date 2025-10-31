'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admins', {
        admin_id: {
            allowNull: false,
            type: Sequelize.UUID,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    await queryInterface.sequelize.query(
        `ALTER TABLE "Admins" DISABLE ROW LEVEL SECURITY;`
    );
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Admins');
}
