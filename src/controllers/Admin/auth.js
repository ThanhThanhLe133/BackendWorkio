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

        if (response.err === 1) {
            return res.status(400).json(response);
        }
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

        if (response.err === 1) {
            return res.status(400).json(response);
        }
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

        if (response.err === 1) {
            return res.status(400).json(response);
        }
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

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const logoutAdmin = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) return badRequest('Missing user id', res);

        const response = await services.logoutAdmin({ user_id });
        if (response.err !== 0) {
            return res.status(401).json(response);
        }
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Logout controller error:', error);
        return internalServerError(res);
    }
};
