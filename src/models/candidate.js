import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Candidate extends Model {
        static associate(models) {
            Candidate.belongsTo(models.User, {
                foreignKey: "candidate_id",
                as: "user",
            });
        }
    }

    Candidate.init(
        {
            candidate_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            resume_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gender: {
                type: DataTypes.ENUM("Male", "Female", "Other"),
                allowNull: true,
            },
            dob: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Candidate",
            underscored: true,
            tableName: "Candidates",
        }
    );

    return Candidate;
};
