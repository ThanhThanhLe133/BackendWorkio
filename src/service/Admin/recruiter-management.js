import { RecruiterManagement } from '../../builder/index.js'

export const createRecruiter = async ({
    email,
    password,
    recruiterInfo,
    addressInfo,
}) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterManagement()
            .setUserInfo({ email, password })
            .setRecruiterInfo(recruiterInfo)
            .setAddressInfo(addressInfo);

        const result = await builder.create();
        resolve(result);;
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});


export const getAllRecruitersAdmin = () => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterManagement()

        const result = await builder.getAllRecruiters();
        resolve(result);;

    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const deleteRecruiterAdmin = (recruiter_id) => new Promise(async (resolve) => {
    try {
        const builder = new RecruiterManagement();
        const result = await builder.deleteRecruiter(recruiter_id);
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
