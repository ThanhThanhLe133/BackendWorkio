import * as services from "../service/index.js";
import { internalServerError, badRequest } from "../middleWares/handle_error.js";
import { getAdminId } from "../helpers/check_user.js";

// Any authenticated user (Candidate/Recruiter/Center/Admin) can create their own request
export const createSupportRequest = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) return badRequest("Missing user id", res);

        const { title, description, priority } = req.body || {};
        if (!title) return badRequest("Missing title", res);

        const response = await services.createSupportRequest({
            user_id,
            title,
            description,
            priority,
        });

        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getMySupportRequests = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) return badRequest("Missing user id", res);

        const response = await services.getMySupportRequests({ user_id });
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

// Admin management endpoints
export const getAllSupportRequestsAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const response = await services.getAllSupportRequestsAdmin();
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateSupportRequestAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { request_id } = req.query;
        if (!request_id) return badRequest("Missing request_id", res);

        const { status, priority } = req.body || {};
        const response = await services.updateSupportRequestAdmin({
            request_id,
            status,
            priority,
        });
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteSupportRequestAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { request_id } = req.query;
        if (!request_id) return badRequest("Missing request_id", res);

        const response = await services.deleteSupportRequestAdmin({ request_id });
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

