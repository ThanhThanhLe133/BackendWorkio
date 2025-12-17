import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class SupportRequest extends Model {
        static associate(models) {
            SupportRequest.belongsTo(models.User, {
                foreignKey: "created_by",
                targetKey: "id",
                as: "creator",
            });
        }
    }

    SupportRequest.init(
        {
            id: {
                allowNull: false,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            priority: {
                type: DataTypes.ENUM("low", "medium", "high"),
                allowNull: false,
                defaultValue: "medium",
            },
            status: {
                type: DataTypes.ENUM("open", "in_progress", "resolved"),
                allowNull: false,
                defaultValue: "open",
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "SupportRequest",
            tableName: "SupportRequests",
            underscored: true,
        }
    );

    return SupportRequest;
};

