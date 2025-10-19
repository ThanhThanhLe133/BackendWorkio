import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Role extends Model {
        static associate(models) {
            Role.hasMany(models.User, {
                foreignKey: 'role_id',
                as: 'users'
            });
        }
    }
    Role.init({
        id: {
            allowNull: false,
            type: DataTypes.UUIDV4,
            primaryKey: true,
        },
        value: {
            allowNull: false,
            type: DataTypes.ENUM('Admin', 'Candidate', 'Recruiter'),
        },
    }, {
        sequelize,
        underscored: true,
        modelName: 'Role',
        tableName: 'Roles'
    });
    return Role;
};
