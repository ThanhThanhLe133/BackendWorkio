import { EducationCenterManagement } from '../../builder/Admin/education-center-management.js';

export const createEducationCenter = async (data) => {
    try {
        const builder = new EducationCenterManagement();
        const result = await builder.create(data);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const getAllEducationCenters = async () => {
    try {
        const builder = new EducationCenterManagement();
        const result = await builder.getAll();
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const getEducationCenterById = async (id) => {
    try {
        const builder = new EducationCenterManagement();
        const result = await builder.getById(id);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const updateEducationCenter = async (id, data) => {
    try {
        const builder = new EducationCenterManagement();
        const result = await builder.update(id, data);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const deleteEducationCenter = async (id) => {
    try {
        const builder = new EducationCenterManagement();
        const result = await builder.delete(id);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};
