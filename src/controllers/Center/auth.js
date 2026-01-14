import * as services from "../../service/index.js";
import { internalServerError, badRequest } from "../../middleWares/handle_error.js";
import { email, password } from "../../helpers/joi_schema.js";
import joi from "joi";

export const loginCenter = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                err: 1,
                mes: "Missing email or password",
            });
        }

        const { error } = joi.object({ email, password }).validate(req.body);
        if (error) return badRequest(error.details[0]?.message, res);

        const response = await services.loginCenter({ ...req.body });
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const forgotPasswordCenter = async (req, res) => {
    try {
        const schema = joi.object({ email });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res);

        const response = await services.forgotPasswordCenter(req.body);

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const resetPasswordCenter = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ err: 1, mes: 'Missing token parameter' });
        }
        const schema = joi.object({ password });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res);

        const response = await services.resetPasswordCenter({ ...req.body, token });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const createNewPasswordCenter = async (req, res) => {
    try {
        const schema = joi.object({ email, password });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res);

        const response = await services.createNewPasswordCenter({ ...req.body });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const logoutCenter = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) return badRequest('Missing user id', res);

        const response = await services.logoutCenter({ user_id });
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

