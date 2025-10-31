import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Field extends Model {
        static associate(models) {

        }
    }

    Field.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isIn: [[
                        "CNTT",          // IT
                        "Tài chính",     // Finance
                        "Marketing",
                        "Thiết kế",      // Design
                        "Bán hàng",      // Sales
                        "Nhân sự",       // HR
                        "Vận hành",      // Operations
                        "Hỗ trợ",        // Support
                        "Pháp lý",       // Legal
                        "Nghiên cứu & Phát triển", // R&D
                        "Khác"           // Other
                    ]]
                }
            }
        },
        {
            sequelize,
            modelName: "Field",
            underscored: true,
            tableName: "Fields",
        }
    );

    return Field;
};
