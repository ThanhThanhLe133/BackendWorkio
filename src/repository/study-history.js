import db from "../models/index.js";

class StudyHistoryRepository {
    async create(studyHistoryData) {
        return await db.StudyHistory.create(studyHistoryData);
    }

    async findAllByCandidate(candidate_id) {
        return await db.StudyHistory.findAll({ where: { candidate_id } });
    }

    async findById(id) {
        return await db.StudyHistory.findByPk(id);
    }

    async update(id, updateData) {
        return await db.StudyHistory.update(updateData, { where: { id } });
    }

    async delete(id) {
        return await db.StudyHistory.destroy({ where: { id } });
    }
}

export { StudyHistoryRepository }
