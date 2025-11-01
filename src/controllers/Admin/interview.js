import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getAdminId } from '../../helpers/check_user.js'

export const createInterviewAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;
        const data = { ...req.body };

        const response = await services.createInterviewAdmin({ data });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const editInterviewAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { interview_id } = req.query;

        const data = { ...req.body };

        const response = await services.editInterviewAdmin({ recruiter_id, interview_id, data });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const deleteInterviewAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;
        const { interview_id } = req.query;

        const response = await services.deleteInterviewAdmin({ recruiter_id, interview_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllInterviewsAdmin = async (req, res) => {
    try {
        const response = await services.getAllInterviewsAdmin({});

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllInterviewsByRecruiter = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;
        const { recruiter_id } = req.query;
        const response = await services.getAllInterviewsByRecruiter({ recruiter_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllInterviewsByCandidate = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;
        const { candidate_id } = req.query;
        const response = await services.getAllInterviewsByCandidate({ candidate_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

