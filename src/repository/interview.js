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

    async getCandidatesOfJob(job_post_id) {
        try {
            const job = await db.JobPost.findOne({
                where: { id: job_post_id },
                attributes: ['applied_candidates', 'updated_at']
            });

            if (!job || !job.applied_candidates || !job.applied_candidates.length) {
                return [];
            }

            // Lấy danh sách Candidate kèm thông tin User VÀ Interview của Job đó
            const candidates = await db.Candidate.findAll({
                where: {
                    candidate_id: { [Op.in]: job.applied_candidates }
                },
                include: [
                    {
                        model: db.User,
                        as: 'candidate', // Alias User
                        attributes: ['name', 'email', 'phone', 'avatar_url']
                    },
                    {
                        model: db.Interview,
                        as: 'interview',
                        required: false,
                        where: { job_post_id: job_post_id } // Chỉ lấy lịch của Job này
                    }
                ]
            });

            // Flatten dữ liệu
            return candidates.map(c => {
                const user = c.candidate || {}; // Alias trong model Candidate là 'candidate' (trỏ tới User)
                const interview = c.interview && c.interview.length > 0 ? c.interview[0] : null;
                
                return {
                    id: c.candidate_id,
                    candidate_id: c.candidate_id,
                    full_name: c.full_name || user.name || "Ứng viên",
                    email: c.email || user.email,
                    phone: c.phone || user.phone,
                    avatar_url: user.avatar_url,
                    experience_years: c.matching_vector?.total_experience_years || 0,
                    major: c.fields_wish ? (Array.isArray(c.fields_wish) ? c.fields_wish[0] : c.fields_wish) : "",
                    applied_at: job.updated_at,
                    // --- MỚI: Trả về trạng thái phỏng vấn ---
                    interview_status: interview ? interview.status : null,
                    interview_id: interview ? interview.id : null
                };
            });
        } catch (error) {
            console.error("Error getting candidates:", error);
            return [];
        }
    }
}

export { InterviewRepository };
