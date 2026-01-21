import db from "../models/index.js";
import { buildMatchingVector, normalizeCvPayload, normalizeStudyHistories, normalizeWorkExperiences } from "../helpers/candidate-profile.js";
import { summarizeCourses } from "../helpers/training.js";
import { CourseRepository } from "./course.js";
import { JobPostRepository } from "./job-post.js";
import { Op } from "sequelize";

const cleanUndefined = (payload = {}) => Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));

class CandidateRepository {
    buildOrder(sort_by, order) {
        const direction = String(order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const map = {
            full_name: ['full_name', direction],
            created_at: ['created_at', direction],
            updated_at: ['updated_at', direction],
        };
        return [map[sort_by] || ['created_at', 'DESC']];
    }

    async getBasicByIds(candidate_ids = []) {
        const ids = Array.isArray(candidate_ids) ? candidate_ids : [candidate_ids];
        if (!ids.length) return [];

        return db.Candidate.findAll({
            where: { candidate_id: { [Op.in]: ids } },
            attributes: ["candidate_id", "full_name", "email", "phone"],
            include: [
                {
                    model: db.User,
                    as: "candidate",
                    attributes: ["id", "email", "name"],
                },
            ],
        });
    }

    async getAll(filters = {}) {
        const {
            search,
            is_verified,
            is_employed,
            job_type,
            working_time,
            graduation_rank,
            minimum_income_from,
            minimum_income_to,
            experience_years_from,
            experience_years_to,
            fields,
            awaiting_interview,
            sort_by,
            order,
        } = filters;

        const where = {};
        if (search) {
            const keyword = `%${search}%`;
            where[Op.or] = [
                { full_name: { [Op.iLike]: keyword } },
                { email: { [Op.iLike]: keyword } },
                { phone: { [Op.iLike]: keyword } },
            ];
        }
        if (is_verified !== undefined) where.is_verified = is_verified === 'true' || is_verified === true;
        if (is_employed !== undefined) where.is_employed = is_employed === 'true' || is_employed === true;
        if (job_type) where.job_type = job_type;
        if (working_time) where.working_time = working_time;
        if (graduation_rank) where.graduation_rank = graduation_rank;
        if (minimum_income_from || minimum_income_to) {
            where.minimum_income = {};
            if (minimum_income_from) where.minimum_income[Op.gte] = Number(minimum_income_from);
            if (minimum_income_to) where.minimum_income[Op.lte] = Number(minimum_income_to);
        }
        if (experience_years_from || experience_years_to) {
            where['matching_vector.total_experience_years'] = {};
            if (experience_years_from) where['matching_vector.total_experience_years'][Op.gte] = Number(experience_years_from);
            if (experience_years_to) where['matching_vector.total_experience_years'][Op.lte] = Number(experience_years_to);
        }
        if (fields) {
            const list = Array.isArray(fields)
                ? fields
                : String(fields)
                    .split(',')
                    .map((f) => f.trim())
                    .filter(Boolean);
            if (list.length) {
                const orConditions = list.map((field) => ({
                    [Op.or]: [
                        { fields_wish: { [Op.contains]: [field] } },
                        {
                            fields_wish: {
                                [Op.contains]: [{ industry: [field] }],
                            },
                        },
                    ],
                }));
                where[Op.and] = where[Op.and] ? [...where[Op.and], ...orConditions] : orConditions;
            }
        }
        if (awaiting_interview === 'true' || awaiting_interview === true) {
            where.candidate_id = {
                [Op.in]: db.Sequelize.literal(`(SELECT candidate_id FROM "Interviews" WHERE status = 'Đang diễn ra')`)
            };
        }

        return db.Candidate.findAll({
            where,
            include: {
                model: db.User,
                as: 'candidate',
            },
            order: this.buildOrder(sort_by, order),
        });
    }

    async getDetailByCandidateId(candidate_id) {
        const candidate = await db.Candidate.findOne({
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
        if (!candidate) return null;

        const courseRepo = new CourseRepository();
        const jobPostRepo = new JobPostRepository();
        const trainingCourses = await courseRepo.getByCandidateId(candidate_id);
        const training_history = summarizeCourses(trainingCourses, candidate_id);
        const appliedJobs = await jobPostRepo.getAllByCandidate(candidate_id);
        const applied_jobs = appliedJobs.map((job) => ({
            job_post_id: job.id,
            position: job.position,
            status: job.status,
            employer: job.recruiter?.company_name || job.recruiter?.name || null,
        }));

        return { ...candidate.toJSON(), training_history, applied_jobs };
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
        const user = await db.User.findOne({
            where: { id: user_id },
            include: [
                {
                    model: db.Candidate,
                    as: 'candidate',
                    include: [
                        { model: db.StudyHistory, as: 'study_history' },
                        { model: db.WorkExperience, as: 'work_experience' },
                    ],
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Candidate' },
                },
            ],
        });

        if (!user?.candidate) return user;

        const courseRepo = new CourseRepository();
        const jobPostRepo = new JobPostRepository();
        const trainingCourses = await courseRepo.getByCandidateId(user.candidate.candidate_id);
        const training_history = summarizeCourses(trainingCourses, user.candidate.candidate_id);
        const appliedJobs = await jobPostRepo.getAllByCandidate(user.candidate.candidate_id);
        const applied_jobs = appliedJobs.map((job) => ({
            job_post_id: job.id,
            position: job.position,
            status: job.status,
            employer: job.recruiter?.company_name || job.recruiter?.name || null,
        }));

        const userJson = user.toJSON();
        userJson.candidate.training_history = training_history;
        userJson.candidate.applied_jobs = applied_jobs;
        return userJson;
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

    async getCandidatesByIds(candidate_ids = []) {
        const ids = Array.isArray(candidate_ids) ? candidate_ids : [candidate_ids];
        if (!ids.length) return [];

        const candidates = await db.Candidate.findAll({
            where: { candidate_id: { [db.Sequelize.Op.in]: ids } },
            include: [
                { 
                    model: db.User, 
                    as: 'candidate',
                    attributes: ['id', 'email', 'name', 'avatar_url']
                }
            ],
        });

        return candidates.map(c => {
            const json = c.toJSON();
            // Lấy full_name từ candidate profile hoặc user name
            json.full_name = c.full_name || c.candidate?.name || null;
            json.email = c.candidate?.email || null;
            json.phone = c.phone || null;
            return json;
        });
    }

    async getCandidatesByIdsWithTraining(candidate_ids = []) {
        const ids = Array.isArray(candidate_ids) ? candidate_ids : [candidate_ids];
        if (!ids.length) return [];

        const candidates = await db.Candidate.findAll({
            where: { candidate_id: { [db.Sequelize.Op.in]: ids } },
            include: [
                { model: db.User, as: 'candidate' },
                { model: db.StudyHistory, as: 'study_history' },
                { model: db.WorkExperience, as: 'work_experience' },
            ],
        });

        const courseRepo = new CourseRepository();
        const enriched = [];
        for (const candidate of candidates) {
            const courses = await courseRepo.getByCandidateId(candidate.candidate_id);
            const training_history = summarizeCourses(courses, candidate.candidate_id);
            const json = candidate.toJSON();
            json.training_history = training_history;
            enriched.push(json);
        }
        return enriched;
    }

    async updateCandidateProfile(user_id, payload) {
        const transaction = await db.sequelize.transaction();
        try {
            const {
                candidateInfo = {},
                addressInfo,
                studyHistories,
                workExperiences,
                cvPayload,
                cv,
            } = payload;

            const candidate = await db.Candidate.findOne({
                where: { candidate_id: user_id },
                transaction,
            });
            if (!candidate) {
                throw new Error("Candidate not found");
            }

            let normalizedStudyHistories = studyHistories !== undefined ? normalizeStudyHistories(studyHistories) : null;
            let normalizedWorkExperiences = workExperiences !== undefined ? normalizeWorkExperiences(workExperiences) : null;
            const incomingCvPayload = cvPayload || cv;
            let cvProfileUpdate = null;
            let mergedCandidateInfo = { ...candidateInfo };

            if (incomingCvPayload) {
                const parsedCv = normalizeCvPayload(incomingCvPayload);
                mergedCandidateInfo = {
                    ...parsedCv.candidateInfo,
                    ...mergedCandidateInfo,
                };
                if (!normalizedStudyHistories) normalizedStudyHistories = parsedCv.studyHistories;
                if (!normalizedWorkExperiences) normalizedWorkExperiences = parsedCv.workExperiences;
                cvProfileUpdate = parsedCv.cvProfile;
            }

            const candidateUpdate = cleanUndefined(mergedCandidateInfo);
            await db.Candidate.update(
                {
                    ...candidateUpdate,
                    ...(cvProfileUpdate ? { cv_profile: cvProfileUpdate, cv_uploaded_at: new Date() } : {}),
                },
                {
                    where: { candidate_id: user_id },
                    transaction,
                }
            );

            if (addressInfo) {
                await db.Address.update(cleanUndefined(addressInfo), {
                    where: { id: candidate.address_id },
                    transaction,
                });
            }

            if (normalizedStudyHistories) {
                await db.StudyHistory.destroy({
                    where: { candidate_id: user_id },
                    transaction,
                });
                if (normalizedStudyHistories.length) {
                    const studyHistoriesWithCandidateId = normalizedStudyHistories.map((history) => ({
                        ...history,
                        candidate_id: user_id,
                    }));
                    await db.StudyHistory.bulkCreate(studyHistoriesWithCandidateId, { transaction });
                }
            }

            if (normalizedWorkExperiences) {
                await db.WorkExperience.destroy({
                    where: { candidate_id: user_id },
                    transaction,
                });
                if (normalizedWorkExperiences.length) {
                    const workExperiencesWithCandidateId = normalizedWorkExperiences.map((experience) => ({
                        ...experience,
                        candidate_id: user_id,
                    }));
                    await db.WorkExperience.bulkCreate(workExperiencesWithCandidateId, { transaction });
                }
            }

            const currentStudyHistories =
                normalizedStudyHistories ??
                (await db.StudyHistory.findAll({ where: { candidate_id: user_id }, transaction }));
            const currentWorkExperiences =
                normalizedWorkExperiences ??
                (await db.WorkExperience.findAll({ where: { candidate_id: user_id }, transaction }));

            const courseRepo = new CourseRepository();
            const trainingHistory = await courseRepo.getByCandidateId(user_id);

            const candidateSnapshot = { ...candidate.toJSON(), ...candidateUpdate };
            const matchingVector = buildMatchingVector(
                candidateSnapshot,
                currentStudyHistories,
                currentWorkExperiences,
                trainingHistory
            );
            await db.Candidate.update(
                { matching_vector: matchingVector },
                { where: { candidate_id: user_id }, transaction }
            );

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export { CandidateRepository }
