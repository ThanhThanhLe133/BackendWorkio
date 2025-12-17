import { JobPostRecruiterBuilder } from '../../builder/index.js';

export const createJobPostRecruiter = async ({ recruiter_id, data }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostRecruiterBuilder()
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

export const editJobPostRecruiter = async ({ recruiter_id, job_post_id, data }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostRecruiterBuilder()
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

        const result = await builder.edit(job_post_id, recruiter_id);
        resolve(result);
    } catch (error) {
        console.error('Edit job post error:', error);
        return { err: 1, mes: error.message };
    }
});

export const deleteJobPostRecruiter = async ({ recruiter_id, job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostRecruiterBuilder();
        const result = await builder.delete(job_post_id, recruiter_id);
        resolve(result);
    } catch (error) {
        console.error('Delete job post error:', error);
        return { err: 1, mes: error.message };
    }
});

export const getAllJobPostsRecruiter = async ({ recruiter_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostRecruiterBuilder();
        const result = await builder.getAllByRecruiter(recruiter_id);
        resolve(result);
    } catch (error) {
        console.error('Get all job posts error:', error);
        return { err: 1, mes: error.message };
    }
});

export const getAllCandidatesOfPostRecruiter = async ({ job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostRecruiterBuilder();

        const result = await builder.getAllCandidatesOfPost(job_post_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});

export const suggestCandidatesForJobRecruiter = async ({ job_post_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new JobPostRecruiterBuilder();
        const result = await builder.suggestCandidatesForJob(job_post_id);
        resolve(result);
    } catch (error) {
        return { err: 1, mes: error.message };
    }
});
