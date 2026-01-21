import db from "../models/index.js";
import { Op } from "sequelize";
import {
    buildJobPostSalaryWhere,
    normalizeFieldsFilter,
} from "../helpers/job-post.js";
class JobPostRepository {
    // async getById(id) {
    //     return db.JobPost.findOne({
    //         where: { id },
    //         include: [
    //             {
    //                 model: db.Recruiter,
    //                 as: 'recruiter',
    //             },
    //             {
    //                 model: db.Interview,
    //                 as: 'job_post',
    //             },
    //         ],
    //     });
    // }

    async getById(id) {
        console.log("getById called with id:", id);
        const result = await db.JobPost.findOne({
            where: { id },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                    // --- FIX: Phải include Address để lấy province_code của Recruiter ---
                    include: [
                        { model: db.Address, as: 'address' } 
                    ]
                }
                // Tạm thời bỏ include Interview nếu không cần thiết để tránh lỗi alias
            ],
        });
        console.log("JobPost query result:", !!result);
        return result;
    }

    async getByIdAndRecruiter(id, recruiter_id) {
        console.log(
            "getByIdAndRecruiter called with id:",
            id,
            "recruiter_id:",
            recruiter_id,
        );
        const result = await db.JobPost.findOne({
            where: { id, recruiter_id },
            include: [
                {
                    model: db.Recruiter,
                    as: "recruiter",
                },
                {
                    model: db.Interview,
                    as: "job_post",
                },
            ],
        });
        console.log("JobPost query result:", !!result);
        return result;
    }
    

    async createJobPost(jobPostData) {
        return await db.JobPost.create(jobPostData);
    }

    async updateJobPost(id, updateData) {
        const [rowsUpdated, [updatedJobPost]] = await db.JobPost.update(
            updateData,
            {
                where: { id },
                returning: true,
            },
        );
        if (rowsUpdated === 0) {
            throw new Error("Job post not found or no changes made");
        }
        return updatedJobPost;
    }

    async deleteJobPost(id) {
        return await db.JobPost.destroy({ where: { id } });
    }

    // async getAllByRecruiter(recruiter_id) {
    //     return db.JobPost.findAll({
    //         where: { recruiter_id },
    //         include: [
    //             { model: db.Recruiter, as: 'recruiter' },
    //             { model: db.Interview, as: 'job_post' },
    //         ],
    //     });
    // }

    // --- FIX LỖI 1: Load danh sách tin tuyển dụng ---
    async getAllByRecruiter(recruiter_id) {
        return db.JobPost.findAll({
            where: { recruiter_id },
            include: [
                { 
                    model: db.Recruiter, 
                    as: 'recruiter',
                    // Include Address để Frontend lọc theo địa chỉ công ty
                    include: [
                        { model: db.Address, as: 'address' } 
                    ]
                },
            ],
            // Sắp xếp theo updated_at để tin mới sửa lên đầu
            order: [['updated_at', 'DESC'], ['created_at', 'DESC']] 
        });
    }

    // async getAllByRecruiterWithFilters(recruiter_id, filters = {}) {
    //     const {
    //         status,
    //         job_type,
    //         working_time,
    //         graduation_rank,
    //         computer_skill,
    //         fields,
    //         min_salary,
    //         max_salary,
    //         search,
    //         limit = 20,
    //         page = 1,
    //     } = filters;

    //     const where = { recruiter_id };
    //     if (status) where.status = status;
    //     if (job_type) where.job_type = job_type;
    //     if (working_time) where.working_time = working_time;
    //     if (graduation_rank) where.graduation_rank = graduation_rank;
    //     if (computer_skill) where.computer_skill = computer_skill;

    //     const salaryWhere = buildJobPostSalaryWhere({ min_salary, max_salary });
    //     if (Object.keys(salaryWhere).length) {
    //         where.monthly_salary = salaryWhere;
    //     }

    //     if (search) {
    //         where.position = { [Op.iLike]: `%${search}%` };
    //     }

    //     const andConditions = [];
    //     const normalizedFields = normalizeFieldsFilter(fields);
    //     if (normalizedFields.length) {
    //         const fieldConditions = normalizedFields.flatMap((field) => ([
    //             { fields: { [Op.contains]: [{ industry: [field] }] } },
    //             { fields: { [Op.contains]: [field] } },
    //         ]));
    //         andConditions.push({ [Op.or]: fieldConditions });
    //     }

    //     const pageNumber = Number(page) > 0 ? Number(page) : 1;
    //     const pageSize = Number(limit) > 0 ? Number(limit) : 20;
    //     const offset = (pageNumber - 1) * pageSize;

    //     const whereClause = { ...where };
    //     if (andConditions.length) whereClause[Op.and] = andConditions;

    //     const { rows, count } = await db.JobPost.findAndCountAll({
    //         where: whereClause,
    //         include: [
    //             { model: db.Recruiter, as: 'recruiter' },
    //             { model: db.Interview, as: 'job_post' },
    //         ],
    //         limit: pageSize,
    //         offset,
    //         order: [['updated_at', 'DESC']],
    //     });

    //     return { rows, count, page: pageNumber, pageSize };
    // }

    async getAllByRecruiterWithFilters(recruiter_id, filters = {}) {
        // ... (Giữ nguyên code bộ lọc cũ của bạn) ...
        const {
            status,
            job_type,
            working_time,
            graduation_rank,
            computer_skill,
            fields,
            min_salary,
            max_salary,
            search,
            limit = 20,
            page = 1,
        } = filters;

        const where = { recruiter_id };
        if (status) where.status = status;
        if (job_type) where.job_type = job_type;
        if (working_time) where.working_time = working_time;
        if (graduation_rank) where.graduation_rank = graduation_rank;
        if (computer_skill) where.computer_skill = computer_skill;

        const salaryWhere = buildJobPostSalaryWhere({ min_salary, max_salary });
        if (Object.keys(salaryWhere).length) {
            where.monthly_salary = salaryWhere;
        }

        if (search) {
            where.position = { [Op.iLike]: `%${search}%` };
        }

        const andConditions = [];
        const normalizedFields = normalizeFieldsFilter(fields);
        if (normalizedFields.length) {
            const fieldConditions = normalizedFields.flatMap((field) => [
                { fields: { [Op.contains]: [{ industry: [field] }] } },
                { fields: { [Op.contains]: [field] } },
            ]);
            andConditions.push({ [Op.or]: fieldConditions });
        }

        const pageNumber = Number(page) > 0 ? Number(page) : 1;
        const pageSize = Number(limit) > 0 ? Number(limit) : 20;
        const offset = (pageNumber - 1) * pageSize;

        const whereClause = { ...where };
        if (andConditions.length) whereClause[Op.and] = andConditions;

        const { rows, count } = await db.JobPost.findAndCountAll({
            where: whereClause,
            include: [
                { 
                    model: db.Recruiter, 
                    as: 'recruiter' ,
                    include: [
                        { model: db.Address, as: 'address' } 
                    ]
                },
            ],
            limit: pageSize,
            offset,
            order: [["updated_at", "DESC"]],
        });

        return { rows, count, page: pageNumber, pageSize };
    }

    // async getAll() {
    //     return db.JobPost.findAll({
    //         include: [
    //             { model: db.Recruiter, as: 'recruiter' },
    //             { model: db.Interview, as: 'job_post' },
    //         ],
    //     });
    // }

    async getAll() {
        return db.JobPost.findAll({
            include: [
                { model: db.Recruiter, as: 'recruiter' },
            ],
        });
    }

    // async getAllByCandidate(candidate_id) {
    //     const candidateJson = JSON.stringify([candidate_id]);
    //     return db.JobPost.findAll({
    //         where: db.Sequelize.where(
    //             db.Sequelize.literal("COALESCE(applied_candidates, '[]')::jsonb"),
    //             { [Op.contains]: db.Sequelize.literal(`'${candidateJson}'::jsonb`) }
    //         ),
    //         include: [
    //             { model: db.Recruiter, as: "recruiter" },
    //             { model: db.Interview, as: "job_post" },
    //         ],
    //     });
    // }

    async getAllByCandidate(candidate_id) {
        const candidateJson = JSON.stringify([candidate_id]);
        return db.JobPost.findAll({
            where: db.Sequelize.where(
                db.Sequelize.literal("COALESCE(applied_candidates, '[]')::jsonb"),
                { [Op.contains]: db.Sequelize.literal(`'${candidateJson}'::jsonb`) },
            ),
            include: [
                { model: db.Recruiter, as: "recruiter" },
            ],
        });
    }

    async getAllCandidates(applied_candidates) {
        return db.Candidate.findAll({
            where: {
                id: { [Op.in]: applied_candidates },
            },
            include: [{ model: db.User, as: "user" }],
        });
    }

    async filterJobsByFields(fieldList = []) {
        return db.JobPost.findAll({
            where: {
                fields: {
                    [Op.or]: fieldList.map((f) => ({
                        [Op.contains]: { industry: [f] },
                    })),
                },
            },
            include: [{ model: db.Interview, as: "job_post" }],
        });
    }

    async getOpenedJobs() {
        return db.JobPost.findAll({
            where: { status: "Đang mở" },
            include: [{ model: db.Recruiter, as: "recruiter" }],
        });
    }

    // --- FIX LỖI 2: Hàm lấy danh sách ứng viên chi tiết ---
    async getAllCandidatesOfPost(job_post_id) {
        try {
            // 1. Lấy thông tin bài đăng để lấy mảng ID
            const job = await db.JobPost.findByPk(job_post_id);
            if (!job || !job.applied_candidates) return [];

            let candidateIds = [];
            // Parse JSON an toàn
            if (Array.isArray(job.applied_candidates)) {
                candidateIds = job.applied_candidates;
            } else if (typeof job.applied_candidates === 'string') {
                try {
                    candidateIds = JSON.parse(job.applied_candidates);
                } catch (e) { return []; }
            }

            if (candidateIds.length === 0) return [];

            // 2. Query DB lấy thông tin chi tiết
            const candidates = await db.Candidate.findAll({
                where: {
                    candidate_id: { [Op.in]: candidateIds }
                },
                include: [
                    {
                        model: db.User,
                        as: 'user', // Alias phải khớp với model.js (User.hasOne Candidate)
                        attributes: ['name', 'email', 'phone', 'avatar_url']
                    }
                ]
            });

            // 3. Flatten dữ liệu để Frontend dễ hiển thị
            return candidates.map(c => {
                const user = c.user || {};
                return {
                    id: c.candidate_id, // ID dùng để tạo interview
                    candidate_id: c.candidate_id,
                    full_name: c.full_name || user.name || "Ứng viên",
                    email: c.email || user.email,
                    phone: c.phone || user.phone,
                    avatar_url: user.avatar_url,
                    experience_years: c.work_experience ? c.work_experience.length : 0, // Ví dụ tính số năm
                    major: c.fields_wish ? c.fields_wish[0] : "", // Lấy ngành nghề chính
                    applied_at: job.updated_at // Tạm lấy thời gian update của job
                };
            });
        } catch (error) {
            console.error("Error getting candidates:", error);
            return [];
        }
    }
    // [NEW] Hàm xóa Interview khi hủy ứng tuyển
    async deleteInterviewsByCandidateAndJob(candidate_id, job_post_id) {
        // Cần import db ở đầu file nếu chưa có
        // Lưu ý: db.Interview phải được định nghĩa trong models/index.js
        return await db.Interview.destroy({
            where: {
                candidate_id: candidate_id,
                job_post_id: job_post_id,
                // Chỉ xóa nếu interview chưa diễn ra hoặc tùy logic (ở đây xóa hết theo yêu cầu của bạn)
                status: { [Op.ne]: 'Đã kết thúc' } // Ví dụ: giữ lại lịch sử nếu đã xong, hoặc xóa hẳn thì bỏ dòng này
            }
        });
    }
}

export { JobPostRepository };
