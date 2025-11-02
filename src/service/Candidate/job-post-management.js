import { JobPostCandidateBuilder } from '../../builder/index.js';

export const applyJobCandidate = async ({ candidate_id, job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostCandidateBuilder();

        const result = await builder.apply(candidate_id, job_post_id);
        resolve(result);
    } catch (error) {
        console.error('Create job post error:', error);
        return { err: 1, mes: error.message };
    }
});

export const getAllJobPostsCandidate = async () => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostCandidateBuilder();
        const result = await builder.getAll();
        resolve(result);
    } catch (error) {
        console.error('Get all job postserror:', error);
        return { err: 1, mes: error.message };
    }
});

export const getAllPostsOfCandidateCandidate = async ({ candidate_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostCandidateBuilder();

        const result = await builder.getAllPostsOfCandidate(candidate_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const filterJobsByFieldsCandidate = async ({ fields }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostCandidateBuilder();
        const result = await builder.filterJobsByFields(fields);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const suggestJobsForCandidate = async ({ candidate_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostCandidateBuilder();
        const result = await builder.suggestJobsForCandidate(candidate_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});
