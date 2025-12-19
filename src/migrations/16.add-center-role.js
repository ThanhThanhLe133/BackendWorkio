"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // Kiểm tra xem role Center đã tồn tại chưa
    const [roles] = await queryInterface.sequelize.query(
        `SELECT * FROM "Roles" WHERE value = 'Center'`
    );

    if (roles.length === 0) {
        await queryInterface.bulkInsert('Roles', [
            {
                id: Sequelize.literal('gen_random_uuid()'),
                value: 'Center',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
        console.log('✅ Role "Center" đã được thêm thành công');
    } else {
        console.log('ℹ️ Role "Center" đã tồn tại');
    }
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', {
        value: 'Center'
    });
}
