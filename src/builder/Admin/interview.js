import { InterviewRepository, JobPostRepository } from "../../repository/index.js";
import { sendInterviewEmail } from "../../helpers/email.js";

export class InterviewAdminBuilder {
    constructor() {
        this.interviewRepo = new InterviewRepository();
        this.jobPostRepo = new JobPostRepository();
        this.interview = {};
    }

    build() {
        return this.interview;
    }

    setCandidateId(candidate_id) { this.interview.candidate_id = candidate_id; return this; }
    setJobPostId(job_post_id) { this.interview.job_post_id = job_post_id; return this; }
    setRecruiterId(recruiter_id) { this.interview.recruiter_id = recruiter_id; return this; }
    setScheduledTime(time) { this.interview.scheduled_time = time; return this; }
    setStatus(status) { this.interview.status = status; return this; }
    setNotes(notes) { this.interview.notes = notes; return this; }
    setLocation(location) { this.interview.location = location; return this; }
    setInterviewType(interview_type) { this.interview.interview_type = interview_type; return this; }

    async create() {
        const interview = await this.interviewRepo.createInterview(this.interview);
        const newInterview = await this.interviewRepo.getById(interview.id);
        await sendInterviewEmail(newInterview.candidate.email, newInterview.job_post, this.interview);
        return {
            err: 0,
            mes: "Tạo interview thành công",
            data: interview
        };
    }

    async edit(id) {
        const interview = await this.interviewRepo.getById(id);
        if (!interview)
            throw new Error("Interview không tồn tại");

        const updated = await this.interviewRepo.updateInterview(id, this.interview);
        return {
            err: 0,
            mes: "Cập nhật interview thành công",
            data: updated
        };
    }

    async delete(id) {
        const interview = await this.interviewRepo.getById(id);
        if (!interview) throw new Error("Interview không tồn tại");

        await this.interviewRepo.deleteInterview(id);
        return {
            err: 0,
            mes: "Xoá cuộc phỏng vấn thành công"
        };
    }

    async getAllInterviews() {
        const interviews = await this.interviewRepo.getAllInterviews(filter);
        return {
            err: 0,
            mes: "Lấy danh sách interview thành công",
            data: interviews
        };
    }

    async getById(id) {
        const interview = await this.interviewRepo.getById(id);
        if (!interview) throw new Error("Interview không tồn tại");
        return {
            err: 0,
            mes: "Lấy interview thành công",
            data: interview
        };
    }

    async getAllInterviewsOfRecruiter(recruiter_id) {
        const interviews = await this.interviewRepo.getAllByRecruiter(recruiter_id);
        return {
            err: 0,
            mes: "Lấy danh sách interview của recruiter thành công",
            data: interviews
        };
    }
    async getAllInterviewsOfCandidate(candidate_id) {
        const interviews = await this.interviewRepo.getAllByRecgetAllByCandidateruiter(candidate_id);
        return {
            err: 0,
            mes: "Lấy danh sách interview của recruiter thành công",
            data: interviews
        };
    }
}
