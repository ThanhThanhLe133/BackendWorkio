import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Role extends Model {
        static associate(models) {
            // define association here
        }
    }

    Role.init(
        {
            code: DataTypes.STRING,
            value: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Role',
        }
    );

    return Role;
};
