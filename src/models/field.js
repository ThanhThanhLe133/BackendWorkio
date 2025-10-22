import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Field extends Model {
        static associate(models) {
        }
    }

    Field.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isIn: [["IT", "Finance", "Marketing", "Design", "Sales", "HR", "Operations", "Support", "Legal", "R&D", "Other"]]
                }
            }
        },
        {
            sequelize,
            modelName: "Field",
            underscored: true,
            tableName: "Fields",
        }
    );

    return Field;
};
