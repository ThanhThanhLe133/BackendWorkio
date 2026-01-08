import { InterviewAdminBuilder } from '../../builder/index.js';

export const getAllInterviewsOfCandidate = async ({ candidate_id }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewAdminBuilder();
        const result = await builder.getAllInterviewsOfCandidate(candidate_id);
        resolve(result);
    } catch (error) {
        console.error('Get all interviews error:', error);
        resolve({ err: 1, mes: error?.message || 'Lấy danh sách phỏng vấn thất bại' });
    }
});
