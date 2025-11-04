import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password } from '../../helpers/joi_schema.js'
import joi from 'joi'
import { getAdminId } from '../../helpers/check_user.js'

export const createCandidate = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate({
            email: req.body.email,
            password: req.body.password
        });

        if (error)
            return badRequest(error.details[0]?.message, res)

        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const response = await services.createCandidate({ ...req.body })

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAlCandidatesAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const response = await services.getAlCandidatesAdmin();
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
export const editCandidateAdmin = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;
        const { candidate_id } = req.query;
        const data = { ...req.body };
        const response = await services.createCandidate({ candidate_id, ...data })

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
