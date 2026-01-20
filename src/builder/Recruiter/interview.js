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
    // FIX LỖI ENUM: Mặc định set là 'Đang diễn ra' nếu FE gửi lên status lạ, hoặc giữ nguyên nếu đúng.
    // Vì DB chỉ chấp nhận: 'Đang diễn ra', 'Đã kết thúc'
    setStatus(status) { 
        const validStatus = ['Đang diễn ra', 'Đã kết thúc'];
        this.interview.status = validStatus.includes(status) ? status : 'Đang diễn ra'; 
        return this; 
    }
    setNotes(notes) { this.interview.notes = notes; return this; }
    setLocation(location) { this.interview.location = location; return this; }
    setInterviewType(interview_type) { this.interview.interview_type = interview_type; return this; }

    async create(recruiter_id, job_post_id) {
        this.interview.job_post_id = job_post_id; // Set job_post_id

        const job_post = await this.jobPostRepo.getById(job_post_id);
        if (!job_post) throw new Error("Bài đăng không tồn tại");
        
        // 1. Check quyền
        if (job_post.recruiter_id !== recruiter_id) {
            throw new Error("Bạn không có quyền tạo cuộc phỏng vấn với bài đăng này");
        }

        // 2. LOGIC MỚI: Check trạng thái bài đăng
        if (job_post.status === 'Đã hủy' || job_post.status === 'Đã tuyển') {
            throw new Error(`Không thể tạo lịch phỏng vấn vì bài đăng đang ở trạng thái: ${job_post.status}`);
        }

        // 3. LOGIC MỚI: Check loại bài đăng
        // Chỉ cho phép tạo nếu recruitment_type là "Phỏng vấn"
        if (job_post.recruitment_type !== 'Phỏng vấn') {
            throw new Error("Bài đăng này không thuộc hình thức 'Phỏng vấn', không thể tạo lịch hẹn.");
        }

        // 4. Check ứng viên đã nộp đơn chưa
        const appliedList = job_post.applied_candidates || []; 
        // Ép kiểu về string để so sánh an toàn
        const isApplied = appliedList.some(id => String(id) === String(this.interview.candidate_id));
        if (!isApplied) {
             throw new Error("Ứng viên này chưa ứng tuyển vào bài đăng này.");
        }

        // 5. Check trùng lịch (Đang diễn ra)
        const existingInterviews = await this.interviewRepo.getAllByCandidate(this.interview.candidate_id);
        const isDuplicate = existingInterviews.find(i => 
            String(i.job_post_id) === String(job_post_id) && 
            i.status === 'Đang diễn ra'
        );
        if (isDuplicate) {
            throw new Error("Ứng viên này đang có một lịch phỏng vấn chưa hoàn tất cho công việc này.");
        }

        // 6. Tạo lịch
        // Đảm bảo status hợp lệ với DB
        if (!this.interview.status) this.interview.status = 'Đang diễn ra';

        const interview = await this.interviewRepo.createInterview(this.interview);
        
        // 7. Gửi Email
        try {
            const newInterview = await this.interviewRepo.getById(interview.id);
            if (newInterview?.candidate?.email) {
                await sendInterviewEmail(newInterview.candidate.email, newInterview.job_post, this.interview);
            }
        } catch (e) {
            console.error("Lỗi gửi email phỏng vấn:", e);
        }

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
