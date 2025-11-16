import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class SocialInsurance extends Model {
        static associate(models) {
            SocialInsurance.belongsTo(models.Candidate, {
                foreignKey: "identify_number",
                targetKey: "identify_number",
                as: "candidate",
                onDelete: "CASCADE"
            });

        }
    }

    SocialInsurance.init(
        {
            insurance_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            indentify_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            insurance_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            company_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            salary_base: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: true,
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            },
        },
        {
            sequelize,
            modelName: "SocialInsurance",
            tableName: "SocialInsurances",
            timestamps: false,
        }
    );

    return SocialInsurance;
};
