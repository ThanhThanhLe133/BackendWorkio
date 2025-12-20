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

    async deleteCourse(course_id, transaction = null) {
        return db.Course.destroy({
            where: { course_id },
            transaction,
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

    async getAllActiveWithCenter() {
        return db.Course.findAll({
            where: { is_active: true },
            include: [
                {
                    model: db.Center,
                    as: 'center',
                    required: true,
                    where: { is_active: true },
                    include: [
                        {
                            model: db.Address,
                            as: 'address',
                        },
                    ],
                },
            ],
            order: [
                ['start_date', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });
    }

    async getByCandidateId(candidate_id) {
        const courses = await db.Course.findAll({
            include: [{ model: db.Center, as: 'center' }],
            order: [['start_date', 'DESC']],
        });

        return courses.filter((course) => {
            const list = Array.isArray(course.candidates) ? course.candidates : [];
            return list.some((item) => item.candidate_id === candidate_id);
        });
    }
}

export { CourseRepository };
