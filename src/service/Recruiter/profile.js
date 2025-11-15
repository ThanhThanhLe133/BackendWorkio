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
