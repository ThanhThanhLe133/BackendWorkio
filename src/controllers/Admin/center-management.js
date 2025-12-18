import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getAdminId } from '../../helpers/check_user.js'

export const getCenterAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { center_id } = req.query;
        if (!center_id) return badRequest('Missing center_id', res);

        const response = await services.getCenterDetailAdmin(center_id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllCentersAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const response = await services.getAllCentersAdmin();
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const createCenterAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const response = await services.createCenterAdmin(req.body);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
