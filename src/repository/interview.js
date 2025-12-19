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

    async updateInterview(id, updateData, options = {}) {
        const { allowStatusChange = false } = options;
        if (!allowStatusChange && Object.prototype.hasOwnProperty.call(updateData, 'status')) {
            throw new Error("Updating interview status is restricted to authorized roles");
        }

        const [rowsUpdated, [updatedInterview]] = await db.Interview.update(updateData, {
            where: { id },
            returning: true,
        });
        return updatedInterview;
    }

    async deleteInterview(id) {
        return await db.Interview.destroy({ where: { id } });
    }

    async getAllInterviews() {
        return db.Interview.findAll({
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

    async getAllByRecruiter(recruiter_id) {
        return db.Interview.findAll({
            include: [
                {
                    model: db.JobPost,
                    as: 'job_post',
                    where: { recruiter_id },
                },
                {
                    model: db.Candidate,
                    as: 'candidate'
                }
            ],
            order: [['scheduled_time', 'ASC']]
        });
    }

    async getAllInterviewsOfRecruiter(recruiter_id) {
        const interviews = await db.Interview.findAll({
            include: [
                {
                    model: db.JobPost,
                    as: 'job_post',
                    where: { recruiter_id },
                },
                {
                    model: db.Candidate,
                    as: 'candidate'
                }
            ],
            order: [['scheduled_time', 'ASC']]
        });

        return {
            err: 0,
            mes: "Lấy danh sách interview của recruiter thành công",
            data: interviews
        };
    }


    async getAllByCandidate(candidate_id) {
        try {
            return await db.Interview.findAll({
                where: { candidate_id },
                include: [
                    {
                        model: db.JobPost,
                        as: 'job_post',
                        include: [
                            {
                                model: db.Recruiter,
                                as: 'recruiter'
                            }
                        ]
                    },
                    { model: db.Candidate, as: 'candidate' },
                ],
                order: [['scheduled_time', 'ASC']],
            });
        } catch (error) {
            console.error('InterviewRepository.getAllByCandidate error:', error);
            return [];
        }
    }
}

export { InterviewRepository };
