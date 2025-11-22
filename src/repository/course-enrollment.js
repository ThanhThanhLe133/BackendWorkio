import db from "../models/index.js";

class CourseEnrollmentRepository {
    async getAll(options = {}) {
        return db.CourseEnrollment.findAll({
            ...options,
            include: [
                {
                    model: db.TrainingCourse,
                    as: 'course',
                },
                {
                    model: db.Candidate,
                    as: 'candidate',
                },
                {
                    model: db.Admin,
                    as: 'admin',
                }
            ],
        });
    }

    async getById(id) {
        return db.CourseEnrollment.findOne({
            where: { id },
            include: [
                {
                    model: db.TrainingCourse,
                    as: 'course',
                },
                {
                    model: db.Candidate,
                    as: 'candidate',
                },
                {
                    model: db.Admin,
                    as: 'admin',
                }
            ],
        });
    }

    async create(data) {
        return db.CourseEnrollment.create(data);
    }

    async update(id, data) {
        return db.CourseEnrollment.update(data, {
            where: { id },
            returning: true,
        });
    }

    async delete(id) {
        return db.CourseEnrollment.destroy({ where: { id } });
    }
}

export { CourseEnrollmentRepository };
