import db from "../models/index.js";

class CourseRepository {
    async createCourse(data, transaction = null) {
        return db.Course.create(data, { transaction });
    }

    async updateCourse(course_id, updateData, transaction = null) {
        return db.Course.update(updateData, {
            where: { course_id },
            returning: true,
            transaction
        });
    }

    async getById(course_id) {
        return db.Course.findOne({ where: { course_id } });
    }

    async getDetail(course_id) {
        return db.Course.findOne({
            where: { course_id },
            include: [
                {
                    model: db.Center,
                    as: 'center',
                }
            ]
        });
    }

    async getByCenterId(center_id) {
        return db.Course.findAll({
            where: { center_id },
            order: [['createdAt', 'DESC']]
        });
    }
}

export { CourseRepository };
