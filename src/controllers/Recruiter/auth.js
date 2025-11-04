import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password } from '../../helpers/joi_schema.js'
import joi from 'joi'

export const verifiedCallBackRecruiter = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ err: 1, mes: 'Missing token parameter' });
        }

        const response = await services.verifiedCallBackRecruiter(token);

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const loginRecruiter = async (req, res) => {
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
        const response = await services.loginRecruiter({ ...req.body })

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}


export const forgotPasswordRecruiter = async (req, res) => {
    try {
        const schema = joi.object({ email });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res);

        const response = await services.forgotPasswordRecruiter(req.body)

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res);
    }
}

export const resetPasswordRecruiter = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ err: 1, mes: 'Missing token parameter' });
        }
        const schema = joi.object({ password });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.resetPasswordRecruiter({ ...req.body, token })

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res);
    }
}

export const createNewPasswordRecruiter = async (req, res) => {
    try {
        const schema = joi.object({ email, password });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.createNewPasswordCandidate({ ...req.body })
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res);
    }
}

export const logoutRecruiter = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) return badRequest('Missing user id', res);

        const response = await services.logoutRecruiter({ user_id });
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
