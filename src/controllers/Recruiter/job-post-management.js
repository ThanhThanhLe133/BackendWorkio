import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getRecruiterId } from '../../helpers/check_user.js'

export const createJobPostRecruiter = async (req, res) => {
    try {
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;

        const data = { ...req.body };

        const response = await services.createJobPostRecruiter({ recruiter_id, data });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const editJobPostRecruiter = async (req, res) => {
    try {
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;

        const { post_id } = req.query;

        const data = { ...req.body };

        const response = await services.editJobPostRecruiter({ recruiter_id, post_id, data });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const deleteJobPostRecruiter = async (req, res) => {
    try {
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;

        const { post_id } = req.query;

        const response = await services.deleteJobPostRecruiter({ recruiter_id, post_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}


export const getAllJobPostsRecruiter = async (req, res) => {
    try {
        const response = await services.getAllJobPostsRecruiter({});

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllCandidatesOfPostRecruiter = async (req, res) => {
    try {

        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;
        const { post_id } = req.query;
        const response = await services.getAllCandidatesOfPostRecruiter({ post_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}