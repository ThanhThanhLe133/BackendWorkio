import { CandidateManagement } from '../../builder/index.js';
import db from '../../models/index.js';
import { CandidateRepository } from '../../repository/index.js';
import { hashPassword } from '../../helpers/fn.js';

export const createCandidate = ({
    email,
    password,
    candidateInfo,
    addressInfo,
    studyHistories = [],
    workExperiences = []
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const builder = new CandidateManagement()
                .setUserInfo({ email, password })
                .setCandidateInfo(candidateInfo)
                .setAddressInfo(addressInfo)
                .setStudyHistories(studyHistories)
                .setWorkExperiences(workExperiences);

            const result = await builder.create();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });
};

export const getAlCandidatesAdmin = (filters = {}) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateManagement()

        const result = await builder.getAllCandidates(filters);
        resolve(result);

    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const getCandidateDetailAdmin = (candidate_id) => new Promise(async (resolve) => {
    try {
        const candidateRepo = new CandidateRepository();
        const candidate = await candidateRepo.getDetailByCandidateId(candidate_id);
        if (!candidate) return resolve({ err: 1, mes: 'Không tìm thấy ứng viên' });

        return resolve({
            err: 0,
            mes: 'Lấy chi tiết ứng viên thành công',
            data: candidate,
        });
    } catch (error) {
        return resolve({ err: 1, mes: error.message });
    }
});

export const deleteCandidateAdmin = (candidate_id) => new Promise(async (resolve) => {
    const transaction = await db.sequelize.transaction();
    try {
        const candidate = await db.Candidate.findOne({
            where: { candidate_id },
            transaction,
        });
        if (!candidate) {
            await transaction.rollback();
            return resolve({ err: 1, mes: 'Không tìm thấy ứng viên' });
        }

        try { await db.Interview.destroy({ where: { candidate_id }, transaction }); } catch { }
        try { await db.StudyHistory.destroy({ where: { candidate_id }, transaction }); } catch { }
        try { await db.WorkExperience.destroy({ where: { candidate_id }, transaction }); } catch { }
        try { await db.SupportRequest.destroy({ where: { created_by: candidate_id }, transaction }); } catch { }

        await db.Candidate.destroy({ where: { candidate_id }, transaction });
        await db.User.destroy({ where: { id: candidate_id }, transaction });

        if (candidate.address_id) {
            try { await db.Address.destroy({ where: { id: candidate.address_id }, transaction }); } catch { }
        }

        await transaction.commit();
        return resolve({ err: 0, mes: 'Xóa ứng viên thành công' });
    } catch (error) {
        await transaction.rollback();
        return resolve({ err: 1, mes: error.message });
    }
});

export const updateCandidateAdmin = (candidate_id, payload) => new Promise(async (resolve) => {
    const transaction = await db.sequelize.transaction();
    try {
        const {
            email,
            password,
            candidateInfo,
            addressInfo,
            studyHistories,
            workExperiences,
        } = payload || {};

        const candidate = await db.Candidate.findOne({ where: { candidate_id }, transaction });
        if (!candidate) {
            await transaction.rollback();
            return resolve({ err: 1, mes: 'Không tìm thấy ứng viên' });
        }

        const user = await db.User.findOne({ where: { id: candidate_id }, transaction });
        if (!user) {
            await transaction.rollback();
            return resolve({ err: 1, mes: 'Không tìm thấy tài khoản ứng viên' });
        }

        if (email) {
            await db.User.update({ email }, { where: { id: candidate_id }, transaction });
        }
        if (password) {
            await db.User.update(
                { password: hashPassword(password) },
                { where: { id: candidate_id }, transaction }
            );
        }

        if (candidateInfo) {
            const nextCandidateInfo = { ...candidateInfo };
            if (email) nextCandidateInfo.email = email;
            await db.Candidate.update(nextCandidateInfo, { where: { candidate_id }, transaction });
        } else if (email) {
            await db.Candidate.update({ email }, { where: { candidate_id }, transaction });
        }

        if (addressInfo) {
            const normalizedAddressInfo = {
                ...addressInfo,
                ward_code: addressInfo.ward_code ?? addressInfo.ward,
            };
            delete normalizedAddressInfo.ward;
            delete normalizedAddressInfo.district_code;

            if (candidate.address_id) {
                await db.Address.update(normalizedAddressInfo, { where: { id: candidate.address_id }, transaction });
            } else {
                const created = await db.Address.create(normalizedAddressInfo, { transaction });
                await db.Candidate.update(
                    { address_id: created.id },
                    { where: { candidate_id }, transaction }
                );
            }
        }

        if (Array.isArray(studyHistories)) {
            await db.StudyHistory.destroy({ where: { candidate_id }, transaction });
            const rows = studyHistories.map((h) => ({
                candidate_id,
                school_name: h.school_name,
                degree: h.degree,
                field_of_study: h.field_of_study ?? h.major ?? h.major_name,
                start_date: h.start_date ?? (h.start_year ? `${h.start_year}-01-01` : null),
                end_date: h.end_date ?? (h.end_year ? `${h.end_year}-01-01` : null),
            }));
            if (rows.length > 0) await db.StudyHistory.bulkCreate(rows, { transaction });
        }

        if (Array.isArray(workExperiences)) {
            await db.WorkExperience.destroy({ where: { candidate_id }, transaction });
            const rows = workExperiences.map((w) => ({
                candidate_id,
                company_name: w.company_name,
                position: w.position,
                description: w.description ?? '',
                start_date: w.start_date ?? null,
                end_date: w.end_date ?? null,
            }));
            if (rows.length > 0) await db.WorkExperience.bulkCreate(rows, { transaction });
        }

        await transaction.commit();
        return resolve({ err: 0, mes: 'Cập nhật ứng viên thành công' });
    } catch (error) {
        await transaction.rollback();
        return resolve({ err: 1, mes: error.message });
    }
});
