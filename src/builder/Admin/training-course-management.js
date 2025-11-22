import { TrainingCourseRepository } from "../../repository/index.js";

export class TrainingCourseManagement {
    constructor() {
        this.repo = new TrainingCourseRepository();
    }

    async create(data) {
        try {
            const newCourse = await this.repo.create(data);
            return {
                err: 0,
                mes: 'Tạo khóa học thành công',
                data: newCourse
            };
        } catch (error) {
            throw error;
        }
    }

    async getAll(options) {
        const courses = await this.repo.getAll(options);
        return {
            err: 0,
            mes: 'Lấy danh sách khóa học thành công',
            data: courses.length > 0 ? courses : []
        };
    }

    async getById(id) {
        const course = await this.repo.getById(id);
        if (!course) {
            return {
                err: 1,
                mes: 'Không tìm thấy khóa học'
            };
        }
        return {
            err: 0,
            mes: 'Lấy thông tin khóa học thành công',
            data: course
        };
    }

    async update(id, data) {
        try {
            await this.repo.update(id, data);
            const updatedCourse = await this.repo.getById(id);
            return {
                err: 0,
                mes: 'Cập nhật khóa học thành công',
                data: updatedCourse
            };
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            await this.repo.delete(id);
            return {
                err: 0,
                mes: 'Xóa khóa học thành công'
            };
        } catch (error) {
            throw error;
        }
    }
}
