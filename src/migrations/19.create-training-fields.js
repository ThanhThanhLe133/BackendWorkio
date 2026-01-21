'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TrainingFields', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // Seed dữ liệu các lĩnh vực đào tạo phổ biến
        await queryInterface.bulkInsert('TrainingFields', [
            {
                name: 'Công nghệ thông tin',
                code: 'IT',
                description: 'Lập trình, phát triển phần mềm, CNTT',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Thiết kế đồ họa',
                code: 'DESIGN',
                description: 'Thiết kế UI/UX, đồ họa, sáng tạo nội dung',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Kinh doanh & Quản trị',
                code: 'BUSINESS',
                description: 'Quản trị kinh doanh, marketing, bán hàng',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Ngoại ngữ',
                code: 'LANGUAGE',
                description: 'Tiếng Anh, tiếng Nhật, tiếng Hàn, tiếng Trung',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Kế toán - Tài chính',
                code: 'ACCOUNTING',
                description: 'Kế toán, kiểm toán, tài chính doanh nghiệp',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Kỹ thuật & Công nghệ',
                code: 'ENGINEERING',
                description: 'Kỹ thuật điện, cơ khí, xây dựng',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Y tế - Sức khỏe',
                code: 'HEALTHCARE',
                description: 'Điều dưỡng, dược, chăm sóc sức khỏe',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Nghề thủ công',
                code: 'HANDICRAFT',
                description: 'Thợ điện, thợ hàn, thợ mộc, sửa chữa',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Dịch vụ - Du lịch',
                code: 'HOSPITALITY',
                description: 'Nhà hàng, khách sạn, du lịch, dịch vụ',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Giáo dục & Đào tạo',
                code: 'EDUCATION',
                description: 'Sư phạm, giảng dạy, đào tạo kỹ năng',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Kỹ năng mềm',
                code: 'SOFT_SKILLS',
                description: 'Giao tiếp, lãnh đạo, quản lý thời gian',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Khác',
                code: 'OTHER',
                description: 'Các lĩnh vực khác',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TrainingFields');
    },
};
