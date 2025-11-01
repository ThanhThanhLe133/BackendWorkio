import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password } from '../../helpers/joi_schema.js'
import joi from 'joi'

export const createRecruiter = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate({
            email: req.body.email,
            password: req.body.password
        });

        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.createRecruiter({ ...req.body })

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}


export const getAllRecruitersAdmin = async (req, res) => {
    try {
        const admin_id = req.user?.id;
        if (!admin_id) {
            return res.status(400).json({ err: 1, mes: 'AdminId is required' });
        }
        const response = await services.getAllRecruitersAdmin();
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
