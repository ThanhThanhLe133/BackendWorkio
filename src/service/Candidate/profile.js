import { CandidateProfileBuilder } from '../../builder/index.js';

export const updateCandidateProfile = (id, payload) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateProfileBuilder()
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

export const getCandidateProfile = (candidate_id) => new Promise(async (resolve) => {
    try {
        const builder = new CandidateProfileBuilder().setId(candidate_id);
        const result = await builder.getProfile();
        if (!result) return resolve({ err: 1, mes: 'Không tìm thấy ứng viên' });
        resolve({ err: 0, mes: 'Lấy profile thành công', data: result });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
