import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class RecruiterDocument extends Model {
        static associate(models) {
            RecruiterDocument.belongsTo(models.Recruiter, {
                foreignKey: "recruiter_id",
                as: "recruiter",
            });
        }
    }

    RecruiterDocument.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            recruiter_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM("Business License", "ISO Certificate", "Other"),
                allowNull: false,
            },
            issue_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            expire_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            file_url: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "RecruiterDocument",
            underscored: true,
            tableName: "RecruiterDocuments",
        }
    );

    return RecruiterDocument;
};
