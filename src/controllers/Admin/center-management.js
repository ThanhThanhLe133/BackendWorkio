import * as services from "../../service/index.js";
import {
    internalServerError,
    badRequest,
} from "../../middleWares/handle_error.js";
import { getAdminId } from "../../helpers/check_user.js";

export const getCenterAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { center_id } = req.query;
        if (!center_id) return badRequest("Missing center_id", res);

        const response = await services.getCenterDetailAdmin(center_id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getAllCentersAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const response = await services.getAllCentersAdmin(req.query);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const createCenterAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        if (!req.body || Object.keys(req.body).length === 0) {
            return badRequest("Request body không được để trống", res);
        }

        const { email, password, centerInfo, addressInfo } = req.body;

        if (!email || !password) {
            return badRequest("Email và password là bắt buộc", res);
        }

        if (!centerInfo || !centerInfo.name) {
            return badRequest("Tên trung tâm là bắt buộc", res);
        }

        const response = await services.createCenterAdmin({
            email,
            password,
            centerInfo,
            addressInfo,
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

export const getCenterCoursesAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { center_id } = req.query;
        if (!center_id) return badRequest("Missing center_id", res);

        const response = await services.getCenterCoursesAdmin(center_id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateCenterAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { center_id } = req.query;
        if (!center_id) return badRequest("Missing center_id", res);

        if (!req.body || Object.keys(req.body).length === 0) {
            return badRequest("Request body không được để trống", res);
        }

        const { centerInfo, addressInfo } = req.body;

        const response = await services.updateCenterAdmin({
            center_id,
            centerInfo,
            addressInfo,
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

export const deleteCenterAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { center_id } = req.query;
        if (!center_id) return badRequest("Missing center_id", res);

        const response = await services.deleteCenterAdmin(center_id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
