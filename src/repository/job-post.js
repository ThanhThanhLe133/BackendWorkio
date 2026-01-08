import db from "../models/index.js";
import { Op } from "sequelize";
import { buildJobPostSalaryWhere, normalizeFieldsFilter } from "../helpers/job-post.js";
class JobPostRepository {
    async getById(id) {
        return db.JobPost.findOne({
            where: { id },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                },
                {
                    model: db.Interview,
                    as: 'job_post',
                },
            ],
        });
    }

    async createJobPost(jobPostData) {
        return await db.JobPost.create(jobPostData);
    }

    async updateJobPost(id, updateData) {
        const [rowsUpdated, [updatedJobPost]] = await db.JobPost.update(updateData, {
            where: { id },
            returning: true,
        });
        return updatedJobPost;
    }

    async deleteJobPost(id) {
        return await db.JobPost.destroy({ where: { id } });
    }

    async getAllByRecruiter(recruiter_id) {
        return db.JobPost.findAll({
            where: { recruiter_id },
            include: [
                { model: db.Recruiter, as: 'recruiter' },
                { model: db.Interview, as: 'job_post' },
            ],
        });
    }

    async getAllByRecruiterWithFilters(recruiter_id, filters = {}) {
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
            const fieldConditions = normalizedFields.flatMap((field) => ([
                { fields: { [Op.contains]: [{ industry: [field] }] } },
                { fields: { [Op.contains]: [field] } },
            ]));
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
                { model: db.Recruiter, as: 'recruiter' },
                { model: db.Interview, as: 'job_post' },
            ],
            limit: pageSize,
            offset,
            order: [['updated_at', 'DESC']],
        });

        return { rows, count, page: pageNumber, pageSize };
    }

    async getAll() {
        return db.JobPost.findAll({
            include: [
                { model: db.Recruiter, as: 'recruiter' },
                { model: db.Interview, as: 'job_post' },
            ],
        });
    }

    async getAllByCandidate(candidate_id) {
        const candidateJson = JSON.stringify([candidate_id]);
        return db.JobPost.findAll({
            where: db.Sequelize.where(
                db.Sequelize.literal("COALESCE(applied_candidates, '[]')::jsonb"),
                { [Op.contains]: db.Sequelize.literal(`'${candidateJson}'::jsonb`) }
            ),
            include: [
                { model: db.Recruiter, as: "recruiter" },
                { model: db.Interview, as: "job_post" },
            ],
        });
    }

    async getAllCandidates(applied_candidates) {
        return db.Candidate.findAll({
            where: {
                id: { [Op.in]: applied_candidates },
            },
            include: [
                { model: db.User, as: "user" }
            ],
        });
    }

    async filterJobsByFields(fieldList = []) {
        return db.JobPost.findAll({
            where: {
                fields: {
                    [Op.or]: fieldList.map(f => ({
                        [Op.contains]: { industry: [f] }
                    }))
                }
            },
            include: [
                { model: db.Interview, as: 'job_post' },
            ],
        });
    }

    async getOpenedJobs() {
        return db.JobPost.findAll({
            where: { status: "Đang mở" },
            include: [{ model: db.Recruiter, as: "recruiter" }],
        });

    }
}

export { JobPostRepository };
