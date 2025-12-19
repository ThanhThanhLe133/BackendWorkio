import * as services from '../../service/index.js';
import { internalServerError, badRequest } from '../../middleWares/handle_error.js';
import { getCenterId } from '../../helpers/check_user.js';
import { ALLOWED_STUDENT_STATUSES } from '../../builder/Center/course-management.js';

export const createCourse = async (req, res) => {
    try {
        const center_id = getCenterId(req, res);
        if (!center_id) return;

        const response = await services.createCourse({
            center_id,
            courseData: req.body
        });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getCenterCourses = async (req, res) => {
    try {
        const center_id = getCenterId(req, res);
        if (!center_id) return;

        const response = await services.getCenterCourses({ center_id });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const addStudentToCourse = async (req, res) => {
    try {
        const center_id = getCenterId(req, res);
        if (!center_id) return;

        const { candidate_id } = req.body;
        if (!candidate_id) return badRequest('candidate_id is required', res);

        const response = await services.addStudentToCourse({
            center_id,
            course_id: req.params.courseId,
            candidate_id
        });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateStudentStatus = async (req, res) => {
    try {
        const center_id = getCenterId(req, res);
        if (!center_id) return;

        const { status, attendance, tuition_confirmed, signed_at, notes } = req.body;
        const candidate_id = req.params.candidateId;
        if (!status) return badRequest('status is required', res);
        if (!ALLOWED_STUDENT_STATUSES.includes(status)) return badRequest('Invalid student status', res);

        const response = await services.updateStudentStatus({
            center_id,
            course_id: req.params.courseId,
            candidate_id,
            status,
            attendance,
            tuition_confirmed,
            signed_at,
            notes,
        });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
