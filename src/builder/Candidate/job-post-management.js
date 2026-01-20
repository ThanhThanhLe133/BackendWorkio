import { JobPostRepository, CandidateRepository } from "../../repository/index.js";
import { calculateMatchScore } from "../../helpers/matching.js";

export class JobPostCandidateBuilder {
    constructor() {
        this.jobPostRepo = new JobPostRepository();
        this.candidateRepo = new CandidateRepository();
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
    //setLanguages(languages) { this.jobPost.languages = languages; return this; }
    setLanguages(languages) {
        // Map đúng vào tên trường "languguages" trong Model Sequelize
        this.jobPostData.languguages = languages; 
        return this;
    }
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

    async apply(candidate_id, job_post_id) {
        const job_post = await this.jobPostRepo.getById(job_post_id);
        if (!job_post)
            throw new Error("Bài đăng không tồn tại");

        if (job_post.status === "Đã tuyển" || job_post.status === "Đã huỷ") {
            return { err: 1, mes: "Bài đăng đã đóng, không thể ứng tuyển" };
        }

        const now = new Date();
        if (job_post.application_deadline_from && new Date(job_post.application_deadline_from) > now) {
            return { err: 1, mes: "Ứng tuyển chưa bắt đầu" };
        }
        if (job_post.application_deadline_to && new Date(job_post.application_deadline_to) < now) {
            return { err: 1, mes: "Hạn nộp đơn đã kết thúc" };
        }

        const appliedCandidates = Array.isArray(job_post.applied_candidates)
            ? job_post.applied_candidates
            : [];

        if (appliedCandidates.includes(candidate_id)) {
            return { err: 1, mes: "Bạn đã ứng tuyển bài đăng này rồi" };
        }

        appliedCandidates.push(candidate_id);

        await this.jobPostRepo.updateJobPost(job_post_id, {
            applied_candidates: appliedCandidates
        });

        return { err: 0, mes: "Ứng tuyển thành công", data: { job_post_id, candidate_id } };
    }


    async getAll() {
        const posts = await this.jobPostRepo.getAll();
        return {
            err: 0,
            mes: "Lấy danh sách bài đăng thành công",
            data: posts
        };
    }

    async getAllByCandidate(candidate_id) {
        const posts = await this.jobPostRepo.getAllByCandidate(candidate_id);
        return {
            err: 0,
            mes: "Lấy danh sách các bài đăng ứng viên đã ứng tuyển thành công",
            data: posts
        };
    }

    async getAllPostsOfCandidate(candidate_id) {
        console.log(candidate_id);
        const posts = await this.jobPostRepo.getAllByCandidate(candidate_id);
        console.log(posts);
        return {
            err: 0,
            mes: "Lấy danh sách các bài đăng ứng viên đã ứng tuyển thành công",
            data: posts
        };
    }

    async filterJobsByFields(fields) {
        const posts = await this.jobPostRepo.filterJobsByFields(fields);
        return {
            err: 0,
            mes: "Lấy danh sách bài đăng theo ngành nghề thành công",
            data: posts,
        };
    }

    // SỬA HÀM NÀY
    async suggestJobsForCandidate(candidate_id) {
        // 1. Lấy thông tin Candidate (kèm work experience, study history để build vector nếu cần)
        const candidate = await this.candidateRepo.getById(candidate_id);
        if (!candidate) throw new Error("Candidate not found");

        // 2. Lấy danh sách việc làm đang mở
        // Cần đảm bảo hàm này trong Repo có include Recruiter
        const allJobPosts = await this.jobPostRepo.getOpenedJobs(); 

        // 3. Tính điểm
        const scoredJobs = allJobPosts.map(jobPost => {
            // Chuyển Sequelize Model sang JSON để xử lý
            const jobJson = jobPost.toJSON ? jobPost.toJSON() : jobPost;
            const candJson = candidate.toJSON ? candidate.toJSON() : candidate;

            const matchScore = calculateMatchScore(jobJson, candJson);
            
            return { 
                ...jobJson, // Copy toàn bộ thông tin job
                match_score: matchScore // Thêm điểm số
            };
        });

        // 4. Lọc và Sắp xếp
        // Lấy những tin có điểm > 0 và sắp xếp từ cao xuống thấp
        const sortedJobs = scoredJobs
            .filter(item => item.match_score > 0)
            .sort((a, b) => b.match_score - a.match_score)
            // Lấy top 20 tin phù hợp nhất
            .slice(0, 20);

        return {
            err: 0,
            mes: "Lấy danh sách gợi ý thành công",
            data: sortedJobs
        };
    }

    // [NEW] Hàm xử lý Hủy Ứng Tuyển
    async cancelApply(candidate_id, job_post_id) {
        // 1. Lấy thông tin bài đăng
        const job_post = await this.jobPostRepo.getById(job_post_id);
        if (!job_post) throw new Error("Bài đăng không tồn tại");

        // 2. Kiểm tra Deadline (Backend validation)
        const now = new Date();
        // Nếu đã qua hạn nộp hồ sơ -> Không cho hủy (Logic theo yêu cầu của bạn)
        if (job_post.application_deadline_to && new Date(job_post.application_deadline_to) < now) {
            return { err: 1, mes: "Đã quá hạn nộp hồ sơ, không thể hủy ứng tuyển lúc này." };
        }

        // 3. Xử lý xóa candidate_id khỏi mảng applied_candidates
        let appliedCandidates = [];
        if (Array.isArray(job_post.applied_candidates)) {
            appliedCandidates = job_post.applied_candidates;
        } else if (typeof job_post.applied_candidates === 'string') {
            try { appliedCandidates = JSON.parse(job_post.applied_candidates); } catch (e) {}
        }

        // Nếu chưa ứng tuyển thì báo lỗi
        if (!appliedCandidates.includes(candidate_id)) {
            return { err: 1, mes: "Bạn chưa ứng tuyển vào vị trí này" };
        }

        // Lọc bỏ ID của candidate
        const newAppliedList = appliedCandidates.filter(id => id !== candidate_id);

        // 4. Cập nhật lại mảng vào DB
        await this.jobPostRepo.updateJobPost(job_post_id, {
            applied_candidates: newAppliedList
        });

        // 5. Xóa các Interview liên quan (Logic: Hủy ứng tuyển -> Hủy luôn phỏng vấn)
        // Gọi hàm delete ở Repo mà ta vừa viết ở Bước 4
        await this.jobPostRepo.deleteInterviewsByCandidateAndJob(candidate_id, job_post_id);

        return { 
            err: 0, 
            mes: "Hủy ứng tuyển thành công. Lịch phỏng vấn liên quan (nếu có) đã được xóa.",
            data: { job_post_id } 
        };
    }
}
