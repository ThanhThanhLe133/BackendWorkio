import db from "../models/index.js";

class TrainingCourseRepository {
    async getAll(options = {}) {
        return db.TrainingCourse.findAll({
            ...options,
            include: [
                {
                    model: db.EducationCenter,
                    as: 'education_center',
                },
                // {
                //     model: db.Field,
                //     as: 'field',
                // }
            ],
        });
    }

    async getById(id) {
        return db.TrainingCourse.findOne({
            where: { id },
            include: [
                {
                    model: db.EducationCenter,
                    as: 'education_center',
                },
                // {
                //     model: db.Field,
                //     as: 'field',
                // }
            ],
        });
    }

    async create(data) {
        return db.TrainingCourse.create(data);
    }

    async update(id, data) {
        return db.TrainingCourse.update(data, {
            where: { id },
            returning: true,
        });
    }

    async delete(id) {
        return db.TrainingCourse.destroy({ where: { id } });
    }
}

export { TrainingCourseRepository };
