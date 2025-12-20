import { RecruiterRepository } from '../../repository/index.js';

export const getRecruiterDetailCandidate = (recruiter_id) => new Promise(async (resolve) => {
    try {
        if (!recruiter_id) {
            return resolve({ err: 1, mes: 'Missing recruiter_id' });
        }
        const repo = new RecruiterRepository();
        const recruiter = await repo.getDetailById(recruiter_id);
        if (!recruiter) {
            return resolve({ err: 1, mes: 'Không tìm thấy nhà tuyển dụng' });
        }
        resolve({ err: 0, mes: 'Lấy chi tiết nhà tuyển dụng thành công', data: recruiter });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
