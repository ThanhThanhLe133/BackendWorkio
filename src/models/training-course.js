'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrainingCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TrainingCourse.belongsTo(models.EducationCenter, {
        foreignKey: 'center_id',
        as: 'education_center',
      });
      // TrainingCourse.belongsTo(models.Field, {
      //   foreignKey: 'field_id',
      //   as: 'field',
      // });
      TrainingCourse.hasMany(models.CourseEnrollment, {
        foreignKey: 'course_id',
        as: 'enrollments',
      });
    }
  }
  TrainingCourse.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      center_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      field_id: {
        type: DataTypes.INTEGER,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      duration: {
        type: DataTypes.STRING,
      },
      tuition_fee: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Đang tuyển sinh',
      },
    },
    {
      sequelize,
      modelName: 'TrainingCourse',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return TrainingCourse;
};
