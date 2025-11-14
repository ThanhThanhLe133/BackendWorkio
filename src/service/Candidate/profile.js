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