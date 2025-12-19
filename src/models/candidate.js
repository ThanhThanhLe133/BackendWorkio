import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Candidate extends Model {
        static associate(models) {
            Candidate.belongsTo(models.User, {
                foreignKey: "candidate_id",
                targetKey: 'id',
                as: "candidate",
            });

            Candidate.belongsTo(models.Address, {
                foreignKey: "address_id",
                as: "address",
            });
            Candidate.hasMany(models.Interview, {
                foreignKey: 'candidate_id',
                as: 'interview',
            });
            Candidate.hasMany(models.StudyHistory, {
                foreignKey: 'candidate_id',
                as: 'study_history',
            });
            Candidate.hasMany(models.WorkExperience, {
                foreignKey: 'candidate_id',
                as: 'work_experience',
            });
            Candidate.hasMany(models.SocialInsurance, {
                foreignKey: "identify_number",
                sourceKey: "identify_number",
                as: "social_insurances",
            });
        }
    }

    Candidate.init(
        {
            candidate_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            identify_number: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            full_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM("Nam", "Nữ", "Khác"),
                allowNull: true,
            },
            date_of_birth: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            place_of_birth: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            ethnicity: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            address_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            national: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            languguages: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            graduation_rank: {
                type: DataTypes.ENUM('Cấp 1', 'Cấp 2', 'Cấp 3', 'Đại học'),
                allowNull: true,
            },
            computer_skill: {
                type: DataTypes.ENUM('Văn phòng', 'Kỹ thuật viên', 'Trung cấp', 'Khác'),
                allowNull: true
            },
            other_computer_skill: {
                type: DataTypes.STRING,
                allowNull: true
            },
            fields_wish: {
                type: DataTypes.JSON,
                allowNull: true
            },
            job_type: {
                type: DataTypes.ENUM('Văn phòng', 'Sản xuất', 'Giao dịch'),
                allowNull: true,
            },
            working_time: {
                type: DataTypes.ENUM('Giờ hành chính', 'Ca kíp', 'Khác'),
                allowNull: true,
            },
            transport: {
                type: DataTypes.ENUM('Xe gắn máy', 'Khác'),
                allowNull: true,
            },
            minimum_income: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: true,
            },
            cv_profile: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            cv_uploaded_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            matching_vector: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            is_employed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Candidate",
            tableName: "Candidates",
            underscored: true,
        }
    );

    return Candidate;
};
