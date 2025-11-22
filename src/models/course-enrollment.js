'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseEnrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CourseEnrollment.belongsTo(models.TrainingCourse, {
        foreignKey: 'course_id',
        as: 'course',
      });
      CourseEnrollment.belongsTo(models.Candidate, {
        foreignKey: 'candidate_id',
        as: 'candidate',
      });
      CourseEnrollment.belongsTo(models.Admin, {
        foreignKey: 'assigned_by_admin_id',
        as: 'admin',
      });
    }
  }
  CourseEnrollment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      course_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      assigned_by_admin_id: {
        type: DataTypes.UUID,
      },
      enrollment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Đang học',
      },
      result_score: {
        type: DataTypes.DECIMAL,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'CourseEnrollment',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return CourseEnrollment;
};
