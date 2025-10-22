import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password } from '../../helpers/joi_schema.js'
import joi from 'joi'

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                err: 1,
                mes: 'Missing email or password',
            })
        }
        const { error } = joi.object({ email, password }).validate(req.body)
        if (error)
            return badRequest(error.details[0]?.message, res)
        const response = await services.loginAdmin({ ...req.body })

        return res.status(200).json(response)
    } catch (error) {
        console.log(error);

        return internalServerError(res)
    }
}
export const forgotPasswordAdmin = async (req, res) => {
    try {
        const schema = joi.object({ email });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res);

        const response = await services.forgotPasswordAdmin(req.body)

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const resetPasswordAdmin = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ err: 1, mes: 'Missing token parameter' });
        }
        const schema = joi.object({ password });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.resetPasswordAdmin({ ...req.body, token })

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const createNewPasswordAdmin = async (req, res) => {
    try {
        const schema = joi.object({ email, password });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.createNewPasswordAdmin({ ...req.body })

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}