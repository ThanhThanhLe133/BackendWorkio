import { CourseEnrollmentManagement } from '../../builder/Admin/course-enrollment-management.js';

export const createCourseEnrollment = async (data) => {
    try {
        const builder = new CourseEnrollmentManagement();
        const result = await builder.create(data);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const getAllCourseEnrollments = async (options) => {
    try {
        const builder = new CourseEnrollmentManagement();
        const result = await builder.getAll(options);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const getCourseEnrollmentById = async (id) => {
    try {
        const builder = new CourseEnrollmentManagement();
        const result = await builder.getById(id);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const updateCourseEnrollment = async (id, data) => {
    try {
        const builder = new CourseEnrollmentManagement();
        const result = await builder.update(id, data);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};

export const deleteCourseEnrollment = async (id) => {
    try {
        const builder = new CourseEnrollmentManagement();
        const result = await builder.delete(id);
        return result;
    } catch (error) {
        return { err: 1, mes: error.message };
    }
};
