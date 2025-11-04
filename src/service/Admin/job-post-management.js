import { JobPostAdminBuilder } from '../../builder/index.js';

export const createJobPostRecruiter = async ({ recruiter_id, data }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder()
            .setAvailableQuantity(data.available_quantity)
            .setRequirements(data.requirements)
            .setDuration(data.duration)
            .setMonthlySalary(data.monthly_salary)
            .setRecruitmentType(data.recruitment_type)
            .setLanguages(data.languages)
            .setRecruiterId(recruiter_id)
            .setApplicationDeadlineFrom(data.application_deadline_from)
            .setApplicationDeadlineTo(data.application_deadline_to)
            .setSupportInfo(data.support_info)
            .setBenefits(data.benefits)
            .setFields(data.fields)
            .setGraduationRank(data.graduation_rank)
            .setComputerSkill(data.computer_skill)
            .setJobType(data.job_type)
            .setWorkingTime(data.working_time)
            .setOtherRequirements(data.other_requirements)
            .setStatus(data.status);

        const result = await builder.create();
        resolve(result);
    } catch (error) {
        console.error('Create job post error:', error);
        return { err: 1, mes: error.message };
    }
});

export const editJobPostAdmin = async ({ job_post_id, data }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder()
            .setAvailableQuantity(data.available_quantity)
            .setPosition(data.position)
            .setRequirements(data.requirements)
            .setDuration(data.duration)
            .setMonthlySalary(data.monthly_salary)
            .setRecruitmentType(data.recruitment_type)
            .setLanguages(data.languages)
            .setApplicationDeadlineFrom(data.application_deadline_from)
            .setApplicationDeadlineTo(data.application_deadline_to)
            .setSupportInfo(data.support_info)
            .setBenefits(data.benefits)
            .setFields(data.fields)
            .setGraduationRank(data.graduation_rank)
            .setComputerSkill(data.computer_skill)
            .setJobType(data.job_type)
            .setWorkingTime(data.working_time)
            .setOtherRequirements(data.other_requirements)
            .setStatus(data.status);

        const result = await builder.edit(job_post_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const deleteJobPostAdmin = async ({ job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();
        const result = await builder.delete(job_post_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const getAllJobPostsAdmin = async () => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();
        const result = await builder.getAll();
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});
export const applyJobAdmin = async ({ candidate_id, job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();

        const result = await builder.apply(candidate_id, job_post_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const getAllPostsOfCandidateAdmin = async ({ candidate_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();

        const result = await builder.getAllPostsOfCandidate(candidate_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const getAllCandidatesOfPostAdmin = async ({ job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();

        const result = await builder.getAllCandidatesOfPost(job_post_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const filterJobsByFieldsAdmin = async ({ fields }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();
        const result = await builder.filterJobsByFields(fields);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const suggestJobsForCandidateAdmin = async ({ candidate_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();
        const result = await builder.suggestJobsForCandidate(candidate_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const suggestCandidatesForJobAdmin = async ({ job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostAdminBuilder();
        const result = await builder.suggestCandidatesForJob(job_post_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});
