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

    //sort jobs by field
    async sortJobsByField(field, jsonKey = null, order = 'ASC') {
        let orderOption;

        if (jsonKey) {
            orderOption = [db.Sequelize.json(`fields.${jsonKey}`), order.toUpperCase()];
        } else {
            orderOption = [field, order.toUpperCase()];
        }

        const jobs = await db.JobPost.findAll({
            include: [
                { model: db.Recruiter, as: 'recruiter' },
                { model: db.Interview, as: 'job_post' },
            ],
            order: [orderOption],
        });

        return {
            err: 0,
            mes: `Jobs sorted by ${jsonKey || field} ${order}`,
            data: jobs,
        };
    }


    async suggestJobsForCandidate(candidate_id) {
        const candidate = await db.Candidate.findOne({
            where: { id: candidate_id },
            include: [{ model: db.User, as: "user" }],
        });

        if (!candidate) throw new Error("Candidate not found");

        const jobs = await db.JobPost.findAll({
            where: { status: "Đang mở" },
            include: [{ model: db.Recruiter, as: "recruiter" }],
        });

        const weightedJobs = jobs.map(job => {
            let score = 0;

            // Trọng số
            const FIELD_WEIGHT = 5;
            const GRAD_WEIGHT = 3;
            const SKILL_WEIGHT = 3;
            const SALARY_WEIGHT = 2;
            const DURATION_WEIGHT = 2;

            if (job.fields?.some(f => candidate.fields?.includes(f))) score += FIELD_WEIGHT;

            // Graduation rank
            if (job.graduation_rank && job.graduation_rank === candidate.graduation_rank) score += GRAD_WEIGHT;

            // Computer skill
            if (job.computer_skill && job.computer_skill === candidate.computer_skill) score += SKILL_WEIGHT;

            // Monthly salary (candidate may have expectation)
            if (job.monthly_salary && candidate.expected_salary && job.monthly_salary >= candidate.expected_salary) score += SALARY_WEIGHT;

            // Duration / job_type match
            if (job.duration && candidate.preferred_duration && job.duration === candidate.preferred_duration) score += DURATION_WEIGHT;

            return { job, score };
        });

        // Sắp xếp theo score giảm dần
        weightedJobs.sort((a, b) => b.score - a.score);

        return weightedJobs.map(wj => ({ ...wj.job.toJSON(), match_score: wj.score }));
    }

    /**
     * Gợi ý candidates cho job dựa trên score matching
     */
    async suggestCandidatesForJobSmart(job_post_id) {
        const job = await db.JobPost.findOne({ where: { id: job_post_id } });
        if (!job) throw new Error("Job post not found");

        const candidates = await db.Candidate.findAll({
            include: [{ model: db.User, as: "user" }],
        });

        const weightedCandidates = candidates.map(candidate => {
            let score = 0;

            // Trọng số
            const FIELD_WEIGHT = 5;
            const GRAD_WEIGHT = 3;
            const SKILL_WEIGHT = 3;
            const SALARY_WEIGHT = 2;
            const DURATION_WEIGHT = 2;

            // Field
            if (candidate.fields?.some(f => job.fields?.includes(f))) score += FIELD_WEIGHT;

            // Graduation rank
            if (candidate.graduation_rank && candidate.graduation_rank === job.graduation_rank) score += GRAD_WEIGHT;

            // Computer skill
            if (candidate.computer_skill && candidate.computer_skill === job.computer_skill) score += SKILL_WEIGHT;

            // Expected salary
            if (candidate.expected_salary && job.monthly_salary && candidate.expected_salary <= job.monthly_salary) score += SALARY_WEIGHT;

            // Preferred duration
            if (candidate.preferred_duration && job.duration && candidate.preferred_duration === job.duration) score += DURATION_WEIGHT;

            return { candidate, score };
        });

        weightedCandidates.sort((a, b) => b.score - a.score);

        return weightedCandidates.map(wc => ({ ...wc.candidate.toJSON(), match_score: wc.score }));
    }

}

export { JobPostRepository };
