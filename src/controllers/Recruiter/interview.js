import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getRecruiterId } from '../../helpers/check_user.js'

export const createInterviewRecruiter = async (req, res) => {
    try {
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;
        const { job_post_id } = req.query;
        const data = { ...req.body };

        const response = await services.createInterviewRecruiter({ recruiter_id, job_post_id, data });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const editInterviewRecruiter = async (req, res) => {
    try {
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;

        const { interview_id } = req.query;

        const data = { ...req.body };

        const response = await services.editInterviewRecruiter({ recruiter_id, interview_id, data });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const deleteInterviewRecruiter = async (req, res) => {
    try {
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;

        const { interview_id } = req.query;

        const response = await services.deleteInterviewRecruiter({ recruiter_id, interview_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}


export const getAllInterviewsRecruiter = async (req, res) => {
    try {
        const response = await services.getAllInterviewsRecruiter({});

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
