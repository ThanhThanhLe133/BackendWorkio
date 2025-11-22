import { TrainingCourseManagement } from '../../builder/Admin/training-course-management.js';

export const createTrainingCourse = async (data) => {
    try {
        const builder = new TrainingCourseManagement();
        const result = await builder.create(data);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const getAllTrainingCourses = async (options) => {
    try {
        const builder = new TrainingCourseManagement();
        const result = await builder.getAll(options);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const getTrainingCourseById = async (id) => {
    try {
        const builder = new TrainingCourseManagement();
        const result = await builder.getById(id);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const updateTrainingCourse = async (id, data) => {
    try {
        const builder = new TrainingCourseManagement();
        const result = await builder.update(id, data);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const deleteTrainingCourse = async (id) => {
    try {
        const builder = new TrainingCourseManagement();
        const result = await builder.delete(id);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};
