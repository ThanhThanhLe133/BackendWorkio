import db from "../models/index.js";

class CandidateRepository {
    async getAll() {
        return db.Candidate.findAll({
            include:
            {
                model: db.User,
                as: 'candidate',
            },
        });
    }

    async getDetailByCandidateId(candidate_id) {
        return db.Candidate.findOne({
            where: { candidate_id },
            include: [
                {
                    model: db.User,
                    as: 'candidate',
                    attributes: ['id', 'email', 'name', 'avatar_url', 'role_id'],
                },
                {
                    model: db.Address,
                    as: 'address',
                },
                {
                    model: db.StudyHistory,
                    as: 'study_history',
                },
                {
                    model: db.WorkExperience,
                    as: 'work_experience',
                },
                {
                    model: db.Interview,
                    as: 'interview',
                    include: [
                        {
                            model: db.JobPost,
                            as: 'job_post',
                        },
                    ],
                },
            ],
        });
    }

    async getByEmail(email) {

        return db.User.findOne({
            where: { email },
            include: [
                {
                    model: db.Candidate,
                    as: 'candidate'
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Candidate' },
                },
            ],
        })
    }

    async getByRefreshToken(refresh_token) {
        return db.User.findOne({
            where: { refresh_token },
            include: [
                {
                    model: db.Candidate,
                    as: 'candidate',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Candidate' },
                },
            ],
        })
    }

    async getById(user_id) {
        return db.User.findOne({
            where: { id: user_id },
            include: [
                {
                    model: db.Candidate,
                    as: 'candidate',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Candidate' },
                },
            ],
        })
    }

    async getRole(value = 'Candidate') {
        return db.Role.findOne({ where: { value } });
    }

    async createCandidate(candidateData) {
        return await db.Candidate.create(candidateData);
    }

    async updateCandidate(candidate_id, updateData) {
        return await db.Candidate.update(updateData, {
            where: { candidate_id },
            returning: true,
        });
    }

    async deleteCandidate(candidate_id) {
        return await db.Candidate.destroy({ where: { candidate_id } });
    }

    async getCandidatesByIds(candidate_ids) {
        return await db.Candidate.findAll({
            where: {
                candidate_id: {
                    [db.Sequelize.Op.in]: candidate_ids
                }
            },
            attributes: ['candidate_id', 'full_name']
        });
    }

    async updateCandidateProfile(user_id, payload) {
        const transaction = await db.sequelize.transaction();
        try {
            const { candidateInfo, addressInfo, studyHistories, workExperiences } = payload;

            const candidate = await db.Candidate.findOne({ where: { candidate_id: user_id } });
            if (!candidate) {
                throw new Error("Candidate not found");
            }

            // Update Candidate
            await db.Candidate.update(candidateInfo, {
                where: { candidate_id: user_id },
                transaction
            });

            // Update Address
            if (addressInfo) {
                await db.Address.update(addressInfo, {
                    where: { id: candidate.address_id },
                    transaction
                });
            }

            // Update Study Histories
            if (studyHistories) {
                await db.StudyHistory.destroy({
                    where: { candidate_id: user_id },
                    transaction
                });
                const studyHistoriesWithCandidateId = studyHistories.map(history => ({
                    ...history,
                    candidate_id: user_id
                }));
                await db.StudyHistory.bulkCreate(studyHistoriesWithCandidateId, { transaction });
            }

            // Update Work Experiences
            if (workExperiences) {
                await db.WorkExperience.destroy({
                    where: { candidate_id: user_id },
                    transaction
                });
                const workExperiencesWithCandidateId = workExperiences.map(experience => ({
                    ...experience,
                    candidate_id: user_id
                }));
                await db.WorkExperience.bulkCreate(workExperiencesWithCandidateId, { transaction });
            }

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export { CandidateRepository }
