import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class RecruiterDocument extends Model {
        static associate(models) {
            RecruiterDocument.belongsTo(models.Recruiter, {
                foreignKey: "recruiter_id",
                as: "recruiter",
            });
        }
    }

    RecruiterDocument.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            recruiter_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "Loại giấy tờ, ví dụ: Giấy phép kinh doanh, Chứng nhận ISO…",
            },
            number: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "Số giấy tờ hoặc mã định danh",
            },
            issue_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            expire_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            file_url: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "URL file giấy tờ",
            },
        },
        {
            sequelize,
            modelName: "RecruiterDocument",
            underscored: true,
            tableName: "RecruiterDocuments",
        }
    );

    return RecruiterDocument;
};
