import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Admin extends Model {
        static associate(models) {
            Admin.belongsTo(models.User, {
                foreignKey: 'admin_id',
                targetKey: 'id',
                as: 'user'
            });
        }
    }
    Admin.init({
        support_id: {
            allowNull: false,
            type: DataTypes.UUID,
            primaryKey: true,
        },
    }, {
        sequelize,
        underscored: true,
        modelName: 'Admin',
        tableName: 'Admins',
        timestamps: false
    });
    return Admin;
};
