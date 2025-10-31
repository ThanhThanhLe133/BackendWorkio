import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Recruiter extends Model {
        static associate(models) {
            Recruiter.belongsTo(models.User, {
                foreignKey: "recruiter_id",
                as: "user",
            });
            Recruiter.belongsTo(models.Address, {
                foreignKey: 'address_id',
                as: 'address',
            });
        }
    }

    Recruiter.init(
        {
            recruiter_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            company_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            address_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: ""
            },
            tax_number: {
                type: DataTypes.STRING(50),
                allowNull: true,
                unique: true,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
                defaultValue: ""
            },
            website: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: ""
            },
            established_at: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
            status: {
                type: DataTypes.ENUM(
                    'Chưa xác minh',       // Not Verified
                    'Đang xem xét',        // Under Review
                    'Đã xác minh',         // Verified
                    'Bị từ chối'           // Rejected
                ),
                allowNull: true,
                defaultValue: 'Chưa xác minh',
            },
        },
        {
            sequelize,
            modelName: "Recruiter",
            underscored: true,
            tableName: "Recruiters",
        }
    );

    return Recruiter;
};
