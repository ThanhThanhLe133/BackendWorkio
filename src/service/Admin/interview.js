import { InterviewAdminBuilder } from '../../builder/index.js';

export const createInterviewAdmin = async ({ data }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewAdminBuilder()
            .setCandidateId(data.candidate_id)
            .setRecruiterId(data.recruiter_id)
            .setJobPostId(data.job_post_id)
            .setScheduledTime(data.scheduled_time)
            .setNotes(data.notes)
            .setLocation(data.location)
            .setInterviewType(data.interview_type)

        const result = await builder.create();
        resolve(result);
    } catch (error) {
        console.error('Create interview error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

export const editInterviewAdmin = async ({ interview_id, data }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewAdminBuilder()
            .setCandidateId(data.candidate_id)
            .setRecruiterId(data.recruiter_id)
            .setJobPostId(data.job_post_id)
            .setScheduledTime(data.scheduled_time)
            .setNotes(data.notes)
            .setLocation(data.location)
            .setInterviewType(data.interview_type)

        const result = await builder.edit(interview_id);
        resolve(result);
    } catch (error) {
        console.error('Edit interview error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

export const deleteInterviewAdmin = async ({ interview_id }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewAdminBuilder();
        const result = await builder.delete(interview_id);
        resolve(result);
    } catch (error) {
        console.error('Delete interview error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

export const getAllInterviewsAdmin = async () => new Promise(async (resolve) => {
    try {
        const builder = new InterviewAdminBuilder();
        const result = await builder.getAllInterviews();
        resolve(result);
    } catch (error) {
        console.error('Get all interviews error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

export const getAllInterviewsByCandidate = async ({ candidate_id }) => new Promise(async (resolve) => {
    try {
        const builder = new InterviewAdminBuilder();
        const result = await builder.getAllInterviewsOfCandidate(candidate_id);
        resolve(result);
    } catch (error) {
        console.error('Get all interviews error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

// Backward-compatible export (older name)
export const getAllInterviewsOfCandidateAdmin = getAllInterviewsByCandidate;
