'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("JobPosts", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                allowNull: false,
                primaryKey: true,
            },
            available_quantity: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            requirements: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            duration: {
                type: Sequelize.ENUM(
                    'Toàn thời gian',
                    'Bán thời gian',
                    'Hợp đồng',
                    'Thực tập',
                    '6 tháng',
                    '12 tháng'
                ),
                allowNull: true,
            },
            monthly_salary: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true,
            },
            recruitment_type: {
                type: Sequelize.ENUM(
                    'Phỏng vấn',
                    'Kiểm tra',
                    'Thử việc'
                ),
                allowNull: true,
            },
            languguages: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            application_deadline_from: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            application_deadline_to: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            support_info: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            benefits: {
                type: Sequelize.ENUM(
                    'Bảo hiểm y tế',
                    'Chương trình đào tạo',
                    'Thưởng'
                ),
            },
            fields: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            applied_candidates: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            job_candidates: {
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
            job_type: {
                type: Sequelize.ENUM('Văn phòng', 'Sản xuất', 'Giao dịch'),
                allowNull: true,
            },
            working_time: {
                type: Sequelize.ENUM('Giờ hành chính', 'Ca kíp', 'Khác'),
                allowNull: true,
            },
            other_requirements: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM(
                    'Đang mở',
                    'Đang xem xét',
                    'Đã phỏng vấn',
                    'Đã tuyển',
                    'Đã hủy'
                ),
                allowNull: true,
                defaultValue: 'Đang mở',
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

        await queryInterface.sequelize.query(`
      ALTER TABLE "JobPosts" DISABLE ROW LEVEL SECURITY;
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("JobPosts");
    },
};
