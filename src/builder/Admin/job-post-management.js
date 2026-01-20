import {
    CandidateRepository,
    JobPostRepository,
} from "../../repository/index.js";
import { calculateMatchScore } from "../../helpers/matching.js";

export class JobPostAdminBuilder {
    constructor() {
        this.jobPostRepo = new JobPostRepository();
        this.candidateRepo = new CandidateRepository();
        this.jobPost = {};
        this.fields = [];
        this.applied_candidates = [];
    }
    setId(id) {
        this.jobPost.id = id;
        return this;
    }
    setAvailableQuantity(qty) {
        this.jobPost.available_quantity = qty;
        return this;
    }
    setPosition(position) {
        this.jobPost.position = position;
        return this;
    }
    setRequirements(req) {
        this.jobPost.requirements = req;
        return this;
    }
    setDuration(duration) {
        this.jobPost.duration = normalizeEnum(duration, ENUMS.duration);
        return this;
    }
    setMonthlySalary(salary) {
        this.jobPost.monthly_salary = salary;
        return this;
    }
    setRecruitmentType(type) {
        this.jobPost.recruitment_type = normalizeEnum(type, ENUMS.recruitment_type);
        return this;
    }
    setLanguages(languages) {
        this.jobPost.languages = languages;
        return this;
    }
    setRecruiterId(id) {
        this.jobPost.recruiter_id = id;
        return this;
    }
    setApplicationDeadlineFrom(date) {
        this.jobPost.application_deadline_from = date;
        return this;
    }
    setApplicationDeadlineTo(date) {
        this.jobPost.application_deadline_to = date;
        return this;
    }
    setSupportInfo(info) {
        this.jobPost.support_info = info;
        return this;
    }
    setBenefits(benefits) {
        const value = Array.isArray(benefits) ? benefits[0] : benefits;
        this.jobPost.benefits = normalizeEnum(value, ENUMS.benefits);
        return this;
    }
    setFields(fields) {
        this.jobPost.fields = fields;
        return this;
    }
    setGraduationRank(rank) {
        this.jobPost.graduation_rank = normalizeEnum(rank, ENUMS.graduation_rank);
        return this;
    }
    setComputerSkill(skill) {
        this.jobPost.computer_skill = normalizeEnum(skill, ENUMS.computer_skill);
        return this;
    }
    setJobType(type) {
        this.jobPost.job_type = normalizeEnum(type, ENUMS.job_type);
        return this;
    }
    setWorkingTime(time) {
        this.jobPost.working_time = normalizeEnum(time, ENUMS.working_time);
        return this;
    }
    setOtherRequirements(req) {
        this.jobPost.other_requirements = req;
        return this;
    }
    setStatus(status) {
        this.jobPost.status = normalizeEnum(status, ENUMS.status, "Đang mở");
        return this;
    }

    build() {
        return this.jobPost;
    }

    async create() {
        const jobPost = await this.jobPostRepo.createJobPost(this.jobPost);
        return {
            err: 0,
            mes: "Thêm bài đăng thành công",
            jobPost,
        };
    }

    async edit(id) {
        console.log(
            "JobPostAdminBuilder.edit called with id:",
            id,
            "jobPost:",
            this.jobPost,
        );
        try {
            const job_post = await this.jobPostRepo.getById(id);
            if (!job_post) throw new Error("Bài đăng không tồn tại");

            if (job_post.status === "Đã tuyển") {
                throw new Error("Không thể chỉnh sửa bài đăng đã tuyển");
            }

            const updated = await this.jobPostRepo.updateJobPost(id, this.jobPost);
            console.log("JobPost updated successfully:", updated);
            return { err: 0, mes: "Chỉnh sửa bài đăng thành công", jobPost: updated };
        } catch (error) {
            console.log("Error in JobPostAdminBuilder.edit:", error);
            throw error;
        }
    }

    async delete(id) {
        const job_post = await this.jobPostRepo.getById(id);
        if (!job_post) throw new Error("Bài đăng không tồn tại");

        await this.jobPostRepo.deleteJobPost(id);
        return {
            err: 0,
            mes: "Xoá bài đăng thành công",
            id,
        };
    }

    async apply(candidate_id, job_post_id) {
        const job_post = await this.jobPostRepo.getById(job_post_id);
        if (!job_post) throw new Error("Bài đăng không tồn tại");

        if (job_post.status === "Đã tuyển" || job_post.status === "Đã huỷ") {
            return { err: 1, mes: "Bài đăng đã đóng, không thể ứng tuyển" };
        }

        const now = new Date();
        if (
            job_post.application_deadline_from &&
            new Date(job_post.application_deadline_from) > now
        ) {
            return { err: 1, mes: "Ứng tuyển chưa bắt đầu" };
        }
        if (
            job_post.application_deadline_to &&
            new Date(job_post.application_deadline_to) < now
        ) {
            return { err: 1, mes: "Hạn nộp đơn đã kết thúc" };
        }

        const appliedCandidates = Array.isArray(job_post.applied_candidates)
            ? job_post.applied_candidates
            : [];

        if (!appliedCandidates.includes(candidate_id)) {
            appliedCandidates.push(candidate_id);
        }

        await this.jobPostRepo.updateJobPost(job_post_id, {
            applied_candidates: appliedCandidates,
        });

        return {
            err: 0,
            mes: "Ứng tuyển thành công",
            data: { job_post_id, candidate_id },
        };
    }

    async getAll() {
        const posts = await this.jobPostRepo.getAll();
        return {
            err: 0,
            mes: "Lấy danh sách bài đăng thành công",
            data: posts,
        };
    }

    async getAllPostsOfCandidate(candidate_id) {
        const posts = await this.jobPostRepo.getAllByCandidate(candidate_id);
        return {
            err: 0,
            mes: "Lấy danh sách các bài đăng ứng viên đã ứng tuyển thành công",
            data: posts,
        };
    }

    async getAllCandidatesOfPost(job_post_id) {
        const job_post = await this.jobPostRepo.getById(job_post_id);
        if (!job_post) throw new Error("Bài đăng không tồn tại");

        const candidates = await this.jobPostRepo.getAllCandidates(
            job_post.applied_candidates,
        );
        return {
            err: 0,
            mes: "Đã lấy danh sách các ứng viên đã ứng tuyển cho bài đăng này",
            data: candidates,
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

    async suggestJobsForCandidate(candidate_id) {
        const candidate = await this.candidateRepo.getById(candidate_id);
        if (!candidate) throw new Error("Candidate not found");
        const allJobPosts = await this.jobPostRepo.getOpenedJobs(candidate_id);

        const scoredJobs = allJobPosts.map((jobPost) => {
            const matchScore = calculateMatchScore(jobPost, candidate);
            return { jobPost, matchScore };
        });
        const sortedJobs = scoredJobs
            .filter((item) => item.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .map((item) => ({
                ...item.jobPost.toJSON(),
                match_score: item.matchScore,
            }));

        return {
            err: 0,
            mes: "Gợi ý việc làm phù hợp cho ứng viên thành công",
            data: sortedJobs,
        };
    }

    async suggestCandidatesForJob(job_post_id) {
        // 1. Lấy tất cả ứng viên (Đảm bảo repo này có include Address/User)
        const allCandidates = await this.candidateRepo.getAll();

        // 2. Lấy Job Post (Đã fix include Address ở bước 1)
        const jobPost = await this.jobPostRepo.getById(job_post_id);
        if (!jobPost) throw new Error("Job post not found");

        if (jobPost.status === "Đã tuyển") {
            throw new Error("Không thể gợi ý ứng viên cho bài đăng đã tuyển");
        }

        const scoredCandidates = allCandidates.map((candidate) => {
            const matchScore = calculateMatchScore(jobPost, candidate);
            return { candidate, matchScore };
        });

        // 4. Sắp xếp và Lọc
        const sortedCandidates = scoredCandidates
            .filter((item) => item.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .map((item) => ({
                ...item.candidate.toJSON(),
                match_score: item.matchScore,
            }));
        return {
            err: 0,
            mes: "Gợi ý ứng viên phù hợp thành công",
            data: sortedCandidates,
        };
    }
}

const ENUMS = {
    recruitment_type: ["Phỏng vấn", "Kiểm tra", "Thử việc"],
    duration: [
        "Toàn thời gian",
        "Bán thời gian",
        "Hợp đồng",
        "Thực tập",
        "6 tháng",
        "12 tháng",
    ],
    benefits: ["Bảo hiểm y tế", "Chương trình đào tạo", "Thưởng"],
    graduation_rank: ["Cấp 1", "Cấp 2", "Cấp 3", "Đại học"],
    computer_skill: ["Văn phòng", "Kỹ thuật viên", "Trung cấp", "Khác"],
    job_type: ["Văn phòng", "Sản xuất", "Giao dịch"],
    working_time: ["Giờ hành chính", "Ca kíp", "Khác"],
    status: ["Đang mở", "Đang xem xét", "Đã tuyển", "Đã hủy"],
};

const normalizeEnum = (value, allowed = [], fallback = null) => {
    if (!value) return fallback;
    const normalized = String(value).toLowerCase();
    const matched = allowed.find((item) => item.toLowerCase() === normalized);
    return matched ?? fallback;
};
