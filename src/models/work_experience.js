import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class WorkExperience extends Model {
        static associate(models) {
            WorkExperience.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
        }
    }

    WorkExperience.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            candidate_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            company_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            position: {
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
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        },
        {
            sequelize,
            modelName: 'WorkExperience',
            tableName: 'WorkExperiences',
            underscored: true,
            timestamps: false,
        }
    );

    return WorkExperience;
};
