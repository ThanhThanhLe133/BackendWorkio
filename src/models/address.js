import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Address extends Model {
        static associate(models) {
            Address.hasOne(models.Recruiter, {
                foreignKey: 'address_id',
                as: 'recruiter',
            });
        }
    }
    Address.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            province_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ward_code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Address',
            tableName: 'Addresses',
            underscored: true,
            timestamps: false,
        }
    );
    return Address;
};
