import db from "../models/index.js";

class RecruiterRepository {
    async getAll() {
        return db.Recruiter.findAll({
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
                    model: db.Recruiter,
                    as: 'recruiter',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Recruiter' },
                },
            ],
        });
    }

    async getByRefreshToken(refresh_token) {
        return db.User.findOne({
            where: { refresh_token },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Recruiter' },
                },
            ],
        });
    }

    async getById(user_id) {
        return db.User.findOne({
            where: { id: user_id },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                },
                {
                    model: db.Role,
                    as: 'role',
                    where: { value: 'Recruiter' },
                },
            ],
        });
    }

    async getRole(value = 'Admin') {
        return db.Role.findOne({ where: { value } });
    }

    async createRecruiter(recruiterData) {
        return db.Recruiter.create(recruiterData);
    }
    async updateRecruiter(recruiter_id, updateData) {
        return db.Recruiter.update(updateData, {
            where: { recruiter_id },
            returning: true,
        });
    }

    async deleteRecruiter(recruiter_id) {
        return db.Recruiter.destroy({ where: { recruiter_id } });
    }

}

export { RecruiterRepository };
