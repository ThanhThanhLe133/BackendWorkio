import { CandidateManagement } from '../../builder/index.js';

export const createCandidate = ({
    email,
    password,
    candidateInfo,
    addressInfo,
    studyHistories = [],
    workExperiences = []
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const builder = new CandidateManagement()
                .setUserInfo({ email, password })
                .setCandidateInfo(candidateInfo)
                .setAddressInfo(addressInfo)
                .setStudyHistories(studyHistories)
                .setWorkExperiences(workExperiences);

            const result = await builder.create();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });
};

export const getAlCandidatesAdmin = () => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateManagement()

        const result = await builder.getAllCandidates();
        resolve(result);

    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const deleteCandidateAdmin = (candidate_id) => new Promise(async (resolve) => {
    try {
        const builder = new CandidateManagement();
        const result = await builder.deleteCandidate(candidate_id);
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

import { UserRepository, CandidateRepository } from '../../repository/index.js';

export const deleteUserAdmin = (user_id) => new Promise(async (resolve) => {
    try {
        const userRepo = new UserRepository();
        const candidateRepo = new CandidateRepository();

        const user = await userRepo.getById(user_id);
        if (!user) return resolve({ err: 1, mes: 'User not found' });

        // If user is a candidate, reuse builder deletion to cascade related entities
        const candidate = await candidateRepo.getById?.(user_id) || null;
        if (candidate) {
            const builder = new CandidateManagement();
            const result = await builder.deleteCandidate(user_id);
            return resolve(result);
        }

        // Otherwise just delete the user
        await userRepo.deleteUser(user_id);
        resolve({ err: 0, mes: 'Xóa người dùng thành công' });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
