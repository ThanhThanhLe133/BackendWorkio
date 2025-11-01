import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getAdminId } from '../../helpers/check_user.js'

export const createJobPostAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;
        const { recruiter_id } = req.query;
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

export const editJobPostAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { post_id } = req.query;

        const data = { ...req.body };

        const response = await services.editJobPostAdmin({ recruiter_id, post_id, data });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const deleteJobPostAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const post_id = req.query;

        const response = await services.deleteJobPostAdmin({ recruiter_id, post_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}


export const getAllJobPostsAdmin = async (req, res) => {
    try {
        const response = await services.getAllJobPostsAdmin();

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const applyJobAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { post_id, candidate_id } = req.query;
        const response = await services.applyJobAdmin({ candidate_id, post_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllPostsOfCandidateAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { candidate_id } = req.query;
        const response = await services.getAllPostsOfCandidateAdmin({ candidate_id, });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllCandidatesOfPostAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { post_id } = req.query;
        const response = await services.getAllCandidatesOfPostAdmin({ post_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
