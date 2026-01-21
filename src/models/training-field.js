import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class TrainingField extends Model {
        static associate(models) {
            // Association nếu cần
        }
    }

    TrainingField.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: "TrainingField",
            tableName: "TrainingFields",
            underscored: true,
        }
    );

    return TrainingField;
};
