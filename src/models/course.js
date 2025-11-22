import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Course extends Model {
        static associate(models) {
            Course.belongsTo(models.Center, {
                foreignKey: "center_id",
                as: "center",
            });
        }
    }

    Course.init(
        {
            course_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            center_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
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
            duration_hours: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            candidates: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: "Course",
            tableName: "Courses",
            underscored: true,
        }
    );

    return Course;
};
