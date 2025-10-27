import db from '../../models/index.js';

// Tách các trường ra cho đúng bảng
const filterFields = (payload) => {
    const userFields = {};
    if (payload.name) userFields.name = payload.name;
    if (payload.avatar_url) userFields.avatar_url = payload.avatar_url;

    const candidateFields = {};
    if (payload.resume_url) candidateFields.resume_url = payload.resume_url;
    if (payload.gender) candidateFields.gender = payload.gender.toLowerCase();
    if (payload.dob) candidateFields.dob = payload.dob;

    return { userFields, candidateFields };
};

export const editCandidateProfile = ({ userId, payload }) =>
    new Promise(async (resolve, reject) => {
        const { userFields, candidateFields } = filterFields(payload);

        try {
            // 1. Bắt đầu Transaction
            const result = await db.sequelize.transaction(async (t) => {

                // 2. Tìm Candidate
                const candidate = await db.Candidate.findOne({
                    where: { candidate_id: userId }, // Dùng userId làm candidate_id
                    transaction: t
                });

                if (!candidate) {
                    throw new Error('Candidate profile not found');
                }

                // 3. Cập nhật bảng Users 
                if (Object.keys(userFields).length > 0) {
                    await db.User.update(userFields, {
                        where: { id: userId },
                        transaction: t
                    });
                }

                // 4. Cập nhật bảng Candidates 
                if (Object.keys(candidateFields).length > 0) {
                    await candidate.update(candidateFields, { transaction: t });
                }

                return { err: 0, mes: 'Profile updated successfully.' };
            });

            resolve(result);

        } catch (error) {
            console.error('Service Error:', error);
            reject({ err: 2, mes: error.message || 'Error updating profile' });
        }
    });