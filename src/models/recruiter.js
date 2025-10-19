import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Recruiter extends Model {
        static associate(models) {
            Recruiter.belongsTo(models.User, {
                foreignKey: "recruiter_id",
                as: "user",
            });

            Recruiter.belongsTo(models.Field, {
                foreignKey: "field_id",
                as: "field",
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
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            field_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            tax_number: {
                type: DataTypes.STRING(50),
                allowNull: true,
                unique: true,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            email_contact: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            website: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            established_at: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
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
