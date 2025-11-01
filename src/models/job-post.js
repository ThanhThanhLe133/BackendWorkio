import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class JobPost extends Model {
        static associate(models) {
            JobPost.belongsTo(models.Recruiter, {
                foreignKey: 'recruiter_id',
                as: 'recruiter',
            });
            JobPost.hasMany(models.Interview, {
                foreignKey: 'job_post_id',
                as: 'job_post',
            });
        }
    }

    JobPost.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            available_quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            requirements: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            duration: {
                type: DataTypes.ENUM(
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
                type: DataTypes.DECIMAL(12, 2),
                allowNull: true,
            },
            recruitment_type: {
                type: DataTypes.ENUM(
                    'Phỏng vấn',            // Interview
                    'Kiểm tra',             // Test
                    'Thử việc'              // Trial
                ),
                allowNull: true,
            },
            languguages: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            application_deadline_from: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            application_deadline_to: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            support_info: {
                type: DataTypes.TEXT, // e.g., transport allowance, accommodation
                allowNull: true,
            },
            benefits: {
                type: DataTypes.ENUM(
                    'Bảo hiểm y tế',
                    'Chương trình đào tạo',
                    'Thưởng'
                ),
            },
            fields: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            applied_candidates: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            job_candidates: {
                type: DataTypes.JSON,
                allowNull: true,
            },

            graduation_rank: {
                type: DataTypes.ENUM('Cấp 1', 'Cấp 2', 'Cấp 3', 'Đại học'),
                allowNull: true,
            },

            computer_skill: {
                type: DataTypes.ENUM('Văn phòng', 'Kỹ thuật viên', 'Trung cấp', 'Khác'),
                allowNull: true,
            },

            job_type: {
                type: DataTypes.ENUM('Văn phòng', 'Sản xuất', 'Giao dịch'),
                allowNull: true,
            },

            working_time: {
                type: DataTypes.ENUM('Giờ hành chính', 'Ca kíp', 'Khác'),
                allowNull: true,
            },

            other_requirements: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM(
                    'Đang mở',       // Open / Active
                    'Đang xem xét',  // Under Review
                    'Đã phỏng vấn',  // Interview
                    'Đã tuyển',      // Accepted / Filled
                    'Đã hủy'         // Cancelled / Rejected
                ),
                allowNull: true,
                defaultValue: 'Đang mở',
            },
        },
        {
            sequelize,
            modelName: 'JobPost',
            tableName: 'JobPosts',
            underscored: true,
            timestamps: false,
        }
    );

    return JobPost;
};
