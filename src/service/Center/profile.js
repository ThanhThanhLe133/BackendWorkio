import { CenterProfileBuilder } from '../../builder/index.js';

export const updateCenterProfile = (id, payload) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CenterProfileBuilder()
            .setId(id)
            .setPayload(payload);

        const result = await builder.updateProfile();
        resolve({
            err: result ? 0 : 1,
            msg: result ? 'Cập nhật thông tin trung tâm thành công' : 'Đã xảy ra lỗi, vui lòng thử lại sau',
            response: result
        });
    } catch (error) {
        reject(error);
    }
});

export const getCenterProfile = (center_id) => new Promise(async (resolve) => {
    try {
        const builder = new CenterProfileBuilder().setId(center_id);
        const result = await builder.getProfile();
        if (!result) return resolve({ err: 1, mes: 'Không tìm thấy trung tâm' });
        resolve({ err: 0, mes: 'Lấy thông tin trung tâm thành công', data: result });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
