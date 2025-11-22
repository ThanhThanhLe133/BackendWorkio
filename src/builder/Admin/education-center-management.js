import { EducationCenterRepository } from "../../repository/index.js";

export class EducationCenterManagement {
    constructor() {
        this.repo = new EducationCenterRepository();
    }

    async create(data) {
        try {
            const newCenter = await this.repo.create(data);
            return {
                err: 0,
                mes: 'Tạo trung tâm đào tạo thành công',
                data: newCenter
            };
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        const centers = await this.repo.getAll();
        return {
            err: 0,
            mes: 'Lấy danh sách trung tâm đào tạo thành công',
            data: centers.length > 0 ? centers : []
        };
    }

    async getById(id) {
        const center = await this.repo.getById(id);
        if (!center) {
            return {
                err: 1,
                mes: 'Không tìm thấy trung tâm đào tạo'
            };
        }
        return {
            err: 0,
            mes: 'Lấy thông tin trung tâm đào tạo thành công',
            data: center
        };
    }

    async update(id, data) {
        try {
            const updatedCenter = await this.repo.update(id, data);
            return {
                err: 0,
                mes: 'Cập nhật trung tâm đào tạo thành công',
                data: updatedCenter
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
                mes: 'Xóa trung tâm đào tạo thành công'
            };
        } catch (error) {
            throw error;
        }
    }
}
