import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class StudyHistory extends Model {
        static associate(models) {
            StudyHistory.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
        }
    }

    StudyHistory.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, allowNull: false,
                primaryKey: true
            },
            candidate_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            school_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            degree: {
                type: DataTypes.STRING,
                allowNull: true
            },
            field_of_study: {
                type: DataTypes.STRING,
                allowNull: true
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            end_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
        },
        {
            sequelize,
            modelName: 'StudyHistory',
            tableName: 'StudyHistories',
            underscored: true,
            timestamps: false,
        }
    );

    return StudyHistory;
};
