import { RecruiterProfileBuilder } from '../../builder/index.js';

export const updateRecruiterProfile = (id, payload) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterProfileBuilder()
            .setId(id)
            .setPayload(payload);

        const result = await builder.updateProfile();
        resolve({
            err: result ? 0 : 1,
            msg: result ? 'Successfully updated profile' : 'An error occurred, please try again later',
            response: result
        });
    } catch (error) {
        reject(error);
    }
});

export const getRecruiterProfile = (recruiter_id) => new Promise(async (resolve) => {
    try {
        const builder = new RecruiterProfileBuilder().setId(recruiter_id);
        const result = await builder.getProfile();
        if (!result) return resolve({ err: 1, mes: 'Không tìm thấy nhà tuyển dụng' });
        resolve({ err: 0, mes: 'Lấy profile thành công', data: result });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
