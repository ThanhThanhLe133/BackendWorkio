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
        resolve(result);;

    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
