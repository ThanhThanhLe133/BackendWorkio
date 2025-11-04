import db from "../models/index.js";

class CandidateRepository {
    async getAll() {
        return db.Candidate.findAll({
            include:
            {
                model: db.User,
                as: 'user',
            },
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
}

export { CandidateRepository }
