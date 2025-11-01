import db from "../models/index.js";

class InterviewRepository {
    async getById(id) {
        return db.Interview.findOne({
            where: { id },
            include: [
                {
                    model: db.Candidate,
                    as: 'candidate',
                },
                {
                    model: db.JobPost,
                    as: 'job_post',
                },
            ],
        });
    }

    async createInterview(interviewData) {
        return await db.Interview.create(interviewData);
    }

    async updateInterview(id, updateData) {
        const [rowsUpdated, [updatedInterview]] = await db.Interview.update(updateData, {
            where: { id },
            returning: true,
        });
        return updatedInterview;
    }

    async deleteInterview(id) {
        return await db.Interview.destroy({ where: { id } });
    }

    async getAll(filter = {}) {
        return db.Interview.findAll({
            where: filter,
            include: [
                {
                    model: db.Candidate,
                    as: 'candidate',
                },
                {
                    model: db.JobPost,
                    as: 'job_post',
                },
            ],
            order: [['scheduled_time', 'ASC']],
        });
    }
}

export { InterviewRepository };
