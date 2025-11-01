import db from "../models/index.js";

class WorkExperienceRepository {
    async create(workExperienceData) {
        return await db.WorkExperience.create(workExperienceData);
    }

    async findAllByCandidate(candidate_id) {
        return await db.WorkExperience.findAll({ where: { candidate_id } });
    }

    async findById(id) {
        return await db.WorkExperience.findByPk(id);
    }

    async update(id, updateData) {
        return await db.WorkExperience.update(updateData, { where: { id } });
    }

    async delete(id) {
        return await db.WorkExperience.destroy({ where: { id } });
    }
}

export { WorkExperienceRepository }
