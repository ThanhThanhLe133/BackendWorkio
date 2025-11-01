import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Interview extends Model {
        static associate(models) {
            Interview.belongsTo(models.Candidate, {
                foreignKey: 'candidate_id',
                as: 'candidate',
            });
            Interview.belongsTo(models.JobPost, {
                foreignKey: 'job_post_id',
                as: 'job_post',
            });

        }
    }

    Interview.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            candidate_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            job_post_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            scheduled_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            interview_type: {
                type: DataTypes.ENUM('Online', 'Offline'),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("Đang diễn ra", "Đã kết thúc"),
                defaultValue: 'Đang diễn ra',
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Interview',
            tableName: 'Interviews',
            underscored: true,
            timestamps: true,
        }
    );

    return Interview;
};
