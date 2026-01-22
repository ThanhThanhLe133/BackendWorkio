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
            include: [
                {
                    model: db.User,
                    as: 'candidate',
                    attributes: ['id', 'email', 'name', 'avatar_url'], // Chỉ lấy field cần thiết
                },
                // --- FIX: Thêm include Address để thuật toán matching tính điểm địa điểm ---
                {
                    model: db.Address,
                    as: 'address',
                },
                // --- Có thể thêm StudyHistory/WorkExperience nếu cần hiển thị chi tiết ---
            ],
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
                studyHistories, // Mảng từ frontend (chứa start_date, end_date, major...)
                workExperiences,
                cvPayload,
                cv,
                avatar_url,
            } = payload;

            const candidate = await db.Candidate.findOne({
                where: { candidate_id: user_id },
                transaction,
            });
            if (!candidate) {
                throw new Error("Candidate not found");
            }
            
            // 1. Cập nhật Avatar (nếu có)
            if (avatar_url !== undefined) {
                await db.User.update(
                    { avatar_url },
                    { where: { id: user_id }, transaction }
                );
            }

            // 1. Cập nhật User (Avatar VÀ Name)
            // Cập nhật bảng User (Tên + Avatar) để đồng bộ dữ liệu login
            const userUpdateData = {};
        
            // Nếu payload có gửi avatar -> update avatar user
            if (avatar_url !== undefined) userUpdateData.avatar_url = avatar_url;
        
            // [FIX] Nếu payload có tên -> update tên user luôn
            if (candidateInfo && candidateInfo.full_name) {
                userUpdateData.name = candidateInfo.full_name;
            }

            if (Object.keys(userUpdateData).length > 0) {
                await db.User.update(
                    userUpdateData,
                    { where: { id: user_id }, transaction }
                );
            }

            // (Giữ logic CV cũ)
            const incomingCvPayload = cvPayload || cv;
            let cvProfileUpdate = null;
            let mergedCandidateInfo = { ...candidateInfo };
            if (incomingCvPayload) {
                const parsedCv = normalizeCvPayload(incomingCvPayload);
                mergedCandidateInfo = { ...parsedCv.candidateInfo, ...mergedCandidateInfo };
                cvProfileUpdate = parsedCv.cvProfile;
                // Lưu ý: Nếu có CV parse, ta tạm thời không ghi đè studyHistory/workExperience tự động
                // vì ưu tiên dữ liệu người dùng nhập từ form
            }

            // 2. Cập nhật thông tin Candidate chính
            const candidateUpdate = cleanUndefined(mergedCandidateInfo);
            await db.Candidate.update(
                {
                    ...candidateUpdate,
                    ...(cvProfileUpdate ? { cv_profile: cvProfileUpdate, cv_uploaded_at: new Date() } : {}),
                },
                { where: { candidate_id: user_id }, transaction }
            );

            // 3. Cập nhật Address
            if (addressInfo) {
                await db.Address.update(cleanUndefined(addressInfo), {
                    where: { id: candidate.address_id },
                    transaction,
                });
            }

            // 4. [CẬP NHẬT QUAN TRỌNG] Xử lý StudyHistory
            // Bỏ qua hàm normalizeStudyHistories cũ vì nó dùng start_year, ta tự map thủ công
            if (studyHistories) {
                await db.StudyHistory.destroy({
                    where: { candidate_id: user_id },
                    transaction,
                });

                if (studyHistories.length > 0) {
                    const cleanStudyHistory = studyHistories.map((item) => ({
                        candidate_id: user_id,
                        school_name: item.school_name,
                        // Map 'major' (Frontend) -> 'field_of_study' (DB)
                        field_of_study: item.major, 
                        degree: item.degree,
                        // Lưu thẳng start_date/end_date (Frontend gửi dạng 'YYYY-MM-DD' hoặc null)
                        start_date: item.start_date || null,
                        end_date: item.end_date || null,
                        // Set mặc định các field required khác nếu cần
                        degree_level: 'Custom' 
                    }));

                    await db.StudyHistory.bulkCreate(cleanStudyHistory, { transaction });
                }
            }

            // 5. Xử lý WorkExperience
            // (Tương tự, ta map lại để chắc chắn)
            if (workExperiences) {
                await db.WorkExperience.destroy({
                    where: { candidate_id: user_id },
                    transaction,
                });
                if (workExperiences.length > 0) {
                     // Dùng trực tiếp dữ liệu từ FE, không cần normalizeWorkExperiences nếu FE đã gửi đúng
                    const cleanWorkExperience = workExperiences.map((item) => ({
                         candidate_id: user_id,
                         company_name: item.company_name,
                         position: item.position,
                         start_date: item.start_date || null,
                         end_date: item.end_date || null,
                         description: item.description
                    }));
                    await db.WorkExperience.bulkCreate(cleanWorkExperience, { transaction });
                }
            }

            // 6. Tính toán lại Vector matching
            const currentStudyHistories = await db.StudyHistory.findAll({ where: { candidate_id: user_id }, transaction });
            const currentWorkExperiences = await db.WorkExperience.findAll({ where: { candidate_id: user_id }, transaction });
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
