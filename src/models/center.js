import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Center extends Model {
        static associate(models) {
            Center.hasMany(models.Course, {
                foreignKey: "center_id",
                as: "courses",
            });
            Center.belongsTo(models.User, {
                foreignKey: 'center_id',
                targetKey: 'id',
                as: 'center'
            });
            Center.belongsTo(models.Address, {
                foreignKey: 'address_id',
                as: 'address'
            });
        }
    }

    Center.init(
        {
            center_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
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
            address_id: {
                type: DataTypes.UUID,
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
            website: {
                type: DataTypes.STRING,
                allowNull: true,
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
            modelName: "Center",
            tableName: "Centers",
            underscored: true,
        }
    );

    return Center;
};
