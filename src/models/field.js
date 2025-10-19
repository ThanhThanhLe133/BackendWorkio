import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Field extends Model {
        static associate(models) {
            Field.hasMany(models.Recruiter, {
                foreignKey: "field_id",
                as: "recruiters",
            });
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
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
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
