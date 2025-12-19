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


export const getAllRecruitersAdmin = (filters = {}) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterManagement()

        const result = await builder.getAllRecruiters(filters);
        resolve(result);;

    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const getRecruiterDetailAdmin = (recruiter_id) => new Promise(async (resolve) => {
    try {
        const repo = new (await import('../../repository/recruiter.js')).RecruiterRepository();
        const recruiter = await repo.getDetailById(recruiter_id);
        if (!recruiter) return resolve({ err: 1, mes: 'Không tìm thấy nhà tuyển dụng' });
        resolve({ err: 0, mes: 'Lấy chi tiết NTD thành công', data: recruiter });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
