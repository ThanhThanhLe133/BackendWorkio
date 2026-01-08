import * as services from '../../service/index.js';
import { internalServerError, badRequest } from '../../middleWares/handle_error.js';
import { getCandidateId } from '../../helpers/check_user.js';

export const getCandidateCourses = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;

        const response = await services.getCandidateCoursesForCandidate({ candidate_id });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const registerCourseCandidate = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;

        const { course_id } = req.body || {};
        if (!course_id) return badRequest('course_id is required', res);

        const response = await services.registerCandidateCourse({ candidate_id, course_id });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
