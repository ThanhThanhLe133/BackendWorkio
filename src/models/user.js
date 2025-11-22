import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });

      User.hasOne(models.Admin, {
        foreignKey: "admin_id",
        sourceKey: "id",
        as: "admin",
      });

      User.hasOne(models.Candidate, {
        foreignKey: "candidate_id",
        sourceKey: "id",
        as: "candidate",
      });

      User.hasOne(models.Recruiter, {
        foreignKey: "recruiter_id",
        sourceKey: "id",
        as: "recruiter",
      });
      User.hasOne(models.Center, {
        foreignKey: "center_id",
        sourceKey: "id",
        as: "center",
      });
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,
      tableName: "Users",
    }
  );

  return User;
};
