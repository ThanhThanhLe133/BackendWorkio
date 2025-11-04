import db from "../models/index.js";

class AddressRepository {
    async getAllByCandidate(candidate_id) {
        return await db.Address.findAll({ where: { candidate_id } });
    }

    async create(data, transaction = null) {
        return await db.Address.create(data, { transaction });
    }

    async destroy(id, transaction = null) {
        return await db.Address.destroy({ where: { id }, transaction });
    }

    async getById(id) {
        return await db.Address.findByPk(id);
    }
}

export { AddressRepository };
