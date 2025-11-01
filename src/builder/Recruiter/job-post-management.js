import { JobPostRepository } from "../../repository/index.js";

export class JobPostRecruiterBuilder {
    constructor() {
        this.jobPostRepo = new JobPostRepository();
        this.jobPost = {};
        this.fields = [];
        this.applied_candidates = [];
    }

    setAvailableQuantity(qty) { this.jobPost.available_quantity = qty; return this; }
    setPosition(position) { this.jobPost.position = position; return this; }
    setRequirements(req) { this.jobPost.requirements = req; return this; }
    setDuration(duration) { this.jobPost.duration = duration; return this; }
    setMonthlySalary(salary) { this.jobPost.monthly_salary = salary; return this; }
    setRecruitmentType(type) { this.jobPost.recruitment_type = type; return this; }
    setLanguages(languages) { this.jobPost.languages = languages; return this; }
    setRecruiterId(id) { this.jobPost.recruiter_id = id; return this; }
    setApplicationDeadlineFrom(date) { this.jobPost.application_deadline_from = date; return this; }
    setApplicationDeadlineTo(date) { this.jobPost.application_deadline_to = date; return this; }
    setSupportInfo(info) { this.jobPost.support_info = info; return this; }
    setBenefits(benefits) { this.jobPost.benefits = benefits; return this; }
    setFields(fields) { this.jobPost.fields = fields; return this; }
    setGraduationRank(rank) { this.jobPost.graduation_rank = rank; return this; }
    setComputerSkill(skill) { this.jobPost.computer_skill = skill; return this; }
    setJobType(type) { this.jobPost.job_type = type; return this; }
    setWorkingTime(time) { this.jobPost.working_time = time; return this; }
    setOtherRequirements(req) { this.jobPost.other_requirements = req; return this; }
    setStatus(status) { this.jobPost.status = status; return this; }

    build() {
        return this.jobPost;
    }

    async create() {
        const jobPost = await this.jobPostRepo.createJobPost(this.jobPost);
        return {
            err: 0,
            mes: "Thêm bài đăng thành công", jobPost
        };
    }

    async edit(id, recruiter_id) {
        const job_post = await this.jobPostRepo.getById(id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");
        if (job_post.recruiter_id !== recruiter_id) {
            throw new Error("Bạn không có quyền chỉnh sửa bài đăng này");
        }
        const updated = await this.jobPostRepo.updateJobPost(id, this.jobPost);
        return { err: 0, mes: "Chỉnh sửa bài đăng thành công", jobPost: updated };
    }

    async delete(id, recruiter_id) {
        const job_post = await this.jobPostRepo.getById(id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");
        if (job_post.recruiter_id !== recruiter_id) {
            throw new Error("Bạn không có quyền xoá bài đăng này");
        }
        await this.jobPostRepo.deleteJobPost(id);
        return {
            err: 0,
            mes: "Xoá bài đăng thành công"
        };
    }

    async editStatus(status) {
        const job_post = await this.jobPostRepo.getById(id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");
        if (job_post.recruiter_id !== recruiter_id) {
            throw new Error("Bạn không có quyền xoá bài đăng này");
        }
        this.jobPost.status = status;
        if (this.jobPost.id) {
            await this.jobPostRepo.updateJobPost(
                this.jobPost.id,
                {
                    status

                });
        }
        return {
            err: 0,
            mes: "Cập nhật trạng thái thành công",
            data: this.jobPost
        };
    }


    async getAllByRecruiter(recruiter_id) {
        const posts = await this.jobPostRepo.getAllByRecruiter(recruiter_id);
        return {
            err: 0,
            mes: "Lấy danh sách bài đăng thành công",
            data: posts
        };
    }

    async getAll() {
        const posts = await this.jobPostRepo.getAll();
        return {
            err: 0,
            mes: "Lấy danh sách bài đăng thành công",
            data: posts
        };
    }


    async getAllCandidatesOfPost(job_post_id) {
        const job_post = await this.jobPostRepo.getById(job_post_id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");

        const candidates = await this.jobPostRepo.getAllCandidates(job_post.applied_candidates);
        return {
            err: 0,
            mes: "Đã lấy danh sách các ứng viên đã ứng tuyển cho bài đăng này",
            data: candidates
        };
    }
}
