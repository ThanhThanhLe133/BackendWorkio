import db from "../../models/index.js";

export const getTrainingFields = async () =>
    new Promise(async (resolve) => {
        try {
            console.log('[Training Fields Service] Fetching training fields...');
            console.log('[Training Fields Service] db.TrainingField exists:', !!db.TrainingField);
            
            const fields = await db.TrainingField.findAll({
                where: {
                    is_active: true,
                },
                attributes: ['id', 'name', 'code', 'description'],
                order: [['name', 'ASC']],
            });

            console.log('[Training Fields Service] Found', fields.length, 'fields');

            resolve({
                err: 0,
                mes: "Lấy danh sách lĩnh vực đào tạo thành công",
                data: fields,
            });
        } catch (error) {
            console.error("[Training Fields Service] Error:", error);
            resolve({
                err: 1,
                mes: error.message || "Lỗi khi lấy danh sách lĩnh vực đào tạo",
            });
        }
    });
