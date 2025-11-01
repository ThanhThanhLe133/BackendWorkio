import { InterviewRecruiterBuilder } from '../../builder/index.js';

export const createInterviewRecruiter = async ({ recruiter_id, job_post_id, data }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewRecruiterBuilder()
            .setCandidateId(data.candidate_id)
            .setScheduledTime(data.scheduled_time)
            .setLocation(data.location)
            .setInterviewType(data.interview_type)
            .setNotes(data.notes);

        const result = await builder.create(recruiter_id, job_post_id);
        resolve(result);
    } catch (error) {
        console.error('Create interview error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

export const editInterviewRecruiter = async ({ recruiter_id, interview_id, data }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewRecruiterBuilder()
            .setCandidateId(data.candidate_id)
            .setScheduledTime(data.scheduled_time)
            .setLocation(data.location)
            .setInterviewType(data.interview_type)
            .setNotes(data.notes);

        const result = await builder.edit(recruiter_id, interview_id);
        resolve(result);
    } catch (error) {
        console.error('Edit interview error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

export const deleteInterviewRecruiter = async ({ recruiter_id, interview_id }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewRecruiterBuilder();
        const result = await builder.delete(recruiter_id, interview_id);
        resolve(result);
    } catch (error) {
        console.error('Delete interview error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

export const getAllInterviewsRecruiter = async ({ recruiter_id }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewRecruiterBuilder();
        const result = await builder.getAllInterviewsOfRecruiter(recruiter_id);
        resolve(result);
    } catch (error) {
        console.error('Get all interviews error:', error);
        resolve({ err: 1, mes: error.message });
    }
});
