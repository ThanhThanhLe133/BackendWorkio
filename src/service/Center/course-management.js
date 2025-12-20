import { CourseManagement } from "../../builder/index.js";

export const createCourse = ({ center_id, courseData }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CourseManagement()
                .setCenterId(center_id)
                .setCourseData(courseData);

            const result = await builder.createCourse();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const getCenterCourses = ({ center_id }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CourseManagement()
                .setCenterId(center_id);

            const result = await builder.getCoursesByCenter();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const updateCourse = ({ center_id, course_id, courseData }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CourseManagement()
                .setCenterId(center_id)
                .setCourseId(course_id)
                .setCourseData(courseData);

            const result = await builder.updateCourse();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const deleteCourse = ({ center_id, course_id }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CourseManagement()
                .setCenterId(center_id)
                .setCourseId(course_id);

            const result = await builder.deleteCourse();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const addStudentToCourse = ({ center_id, course_id, candidate_id }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CourseManagement()
                .setCenterId(center_id)
                .setCourseId(course_id)
                .setCandidateId(candidate_id);

            const result = await builder.addCandidateToCourse();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const removeStudentFromCourse = ({ center_id, course_id, candidate_id }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CourseManagement()
                .setCenterId(center_id)
                .setCourseId(course_id)
                .setCandidateId(candidate_id);

            const result = await builder.removeCandidateFromCourse();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const updateStudentStatus = ({ center_id, course_id, candidate_id, status, attendance, tuition_confirmed, signed_at, notes }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CourseManagement()
                .setCenterId(center_id)
                .setCourseId(course_id)
                .setCandidateId(candidate_id)
                .setStatus(status)
                .setAttendance(attendance)
                .setTuitionConfirmed(tuition_confirmed)
                .setSignedAt(signed_at)
                .setNotes(notes);

            const result = await builder.updateCandidateStatus();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });
