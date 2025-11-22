'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EducationCenter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EducationCenter.belongsTo(models.Address, {
        foreignKey: 'address_id',
        as: 'address',
      });
      EducationCenter.hasMany(models.TrainingCourse, {
        foreignKey: 'center_id',
        as: 'courses'
      });
    }
  }
  EducationCenter.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      address_id: {
        type: DataTypes.UUID,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'EducationCenter',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return EducationCenter;
};
