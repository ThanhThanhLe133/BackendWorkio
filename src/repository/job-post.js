import db from "../models/index.js";
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

    async getAll() {
        return db.JobPost.findAll({
            include: [
                { model: db.Recruiter, as: 'recruiter' },
                { model: db.Interview, as: 'job_post' },
            ],
        });
    }

    async getAllByCandidate(candidate_id) {
        return db.JobPost.findAll({
            where: {
                applied_candidates: {
                    [Op.contains]: [candidate_id]
                }
            },
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
