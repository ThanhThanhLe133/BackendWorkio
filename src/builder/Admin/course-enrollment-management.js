import { CourseEnrollmentRepository } from "../../repository/index.js";

export class CourseEnrollmentManagement {
    constructor() {
        this.repo = new CourseEnrollmentRepository();
    }

    async create(data) {
        try {
            const newEnrollment = await this.repo.create(data);
            return {
                err: 0,
                mes: 'Ghi danh thành công',
                data: newEnrollment
            };
        } catch (error) {
            throw error;
        }
    }

    async getAll(options) {
        const enrollments = await this.repo.getAll(options);
        return {
            err: 0,
            mes: 'Lấy danh sách ghi danh thành công',
            data: enrollments.length > 0 ? enrollments : []
        };
    }

    async getById(id) {
        const enrollment = await this.repo.getById(id);
        if (!enrollment) {
            return {
                err: 1,
                mes: 'Không tìm thấy lượt ghi danh'
            };
        }
        return {
            err: 0,
            mes: 'Lấy thông tin ghi danh thành công',
            data: enrollment
        };
    }

    async update(id, data) {
        try {
            await this.repo.update(id, data);
            const updatedEnrollment = await this.repo.getById(id);
            return {
                err: 0,
                mes: 'Cập nhật ghi danh thành công',
                data: updatedEnrollment
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
                mes: 'Xóa ghi danh thành công'
            };
        } catch (error) {
            throw error;
        }
    }
}
