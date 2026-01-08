import { InterviewRepository, JobPostRepository } from "../../repository/index.js";
import { sendInterviewEmail } from "../../helpers/email.js";

export class InterviewRecruiterBuilder {
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

    async create(recruiter_id, job_post_id) {
        const job_post = await this.jobPostRepo.getById(job_post_id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");
        if (job_post.recruiter_id !== recruiter_id) {
            throw new Error("Bạn không có quyền tạo cuộc phỏng vấn với bài đăng này");
        }
        const interview = await this.interviewRepo.createInterview(this.interview);
        const newInterview = await this.interviewRepo.getById(interview.id);
        await sendInterviewEmail(newInterview.candidate.email, newInterview.job_post, this.interview);
        return {
            err: 0,
            mes: "Tạo cuộc phỏng vấn thành công",
            data: interview
        };
    }

    async edit(recruiter_id, id) {
        const interview = await this.interviewRepo.getById(id);
        if (!interview)
            throw new Error("Cuộc phỏng vấn không tồn tại");

        const job_post = await this.jobPostRepo.getById(interview.job_post_id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");
        if (job_post.recruiter_id !== recruiter_id) {
            throw new Error("Bạn không có quyền tạo cuộc phỏng vấn với bài đăng này");
        }

        const updated = await this.interviewRepo.updateInterview(id, this.interview, { allowStatusChange: true });
        return {
            err: 0,
            mes: "Cập nhật interview thành công",
            data: updated
        };
    }

    async delete(recruiter_id, id) {
        const interview = await this.interviewRepo.getById(id);
        if (!interview) throw new Error("Interview không tồn tại");

        const job_post = await this.jobPostRepo.getById(interview.job_post_id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");
        if (job_post.recruiter_id !== recruiter_id) {
            throw new Error("Bạn không có quyền xoá cuộc phỏng vấn với bài đăng này");
        }

        await this.interviewRepo.deleteInterview(id);
        return {
            err: 0,
            mes: "Xoá interview thành công"
        };
    }

    async getAll() {
        const interviews = await this.interviewRepo.getAllInterviews();
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

}
