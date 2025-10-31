'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Candidates', {
        candidate_id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
        },
        full_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        gender: {
            type: Sequelize.ENUM("Nam", "Nữ", "Khác"),
            allowNull: true,
        },
        date_of_birth: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        place_of_birth: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ethnicity: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        address_id: {
            type: Sequelize.UUID,
            allowNull: true,
        },
        national_id: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        languguages: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        graduation_rank: {
            type: Sequelize.ENUM('Cấp 1', 'Cấp 2', 'Cấp 3', 'Đại học'),
            allowNull: true,
        },
        computer_skill: {
            type: Sequelize.ENUM('Văn phòng', 'Kỹ thuật viên', 'Trung cấp', 'Khác'),
            allowNull: true,
        },
        other_computer_skill: {
            type: Sequelize.STRING,
            allowNull: true
        },
        fields_wish: {
            type: Sequelize.JSON,
            allowNull: true
        },
        job_type: {
            type: Sequelize.ENUM('Văn phòng', 'Sản xuất', 'Giao dịch'),
            allowNull: true,
        },
        working_time: {
            type: Sequelize.ENUM('Giờ hành chính', 'Ca kíp', 'Khác'),
            allowNull: true,
        },
        transport: {
            type: Sequelize.ENUM('Xe gắn máy', 'Khác'),
            allowNull: true,
        },
        minimum_income: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true,
        },
        is_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM(
                'Chưa xác minh',
                'Đang xem xét',
                'Đã xác minh',
                'Bị từ chối'
            ),
            allowNull: true,
            defaultValue: 'Chưa xác minh',
        },
        is_employed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
        }
    });

    await queryInterface.sequelize.query(
        `ALTER TABLE "Candidates" DISABLE ROW LEVEL SECURITY;`
    );
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Candidates');
}
