import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password } from '../../helpers/joi_schema.js'
import joi from 'joi'

export const registerRecruiter = async (req, res) => {
    try {
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(6).required(),
            company_name: joi.string().required(),
            province_code: joi.string().required(),
            ward_code: joi.string().optional(),
            street: joi.string().optional(),
            tax_number: joi.string().required(),
            phone: joi.string().pattern(/^[0-9]+$/).required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        const response = await services.registerRecruiter({
            ...req.body,
        });
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const verifiedCallBackRecruiter = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ err: 1, mes: 'Missing token parameter' });
        }

        const response = await services.verifiedCallBackRecruiter(token);

        return res.status(200).json(response)
    } catch (error) {
        console.log(error);

        return internalServerError(res)
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

        return res.status(200).json(response)
    } catch (error) {
        console.log(error);

        return internalServerError(res)
    }
}

export const uploadDocuments = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return badRequest('No file uploaded', res);
        }

        const files = req.files?.documents || [];
        const ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"];

        for (const file of files) {
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                return badRequest(`File type not allowed: ${file.originalname}`, res);
            }
        }
        const response = await services.uploadRecruiterDocuments(req.user.id, files);

        return res.status(200).json(response);
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

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
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

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const createNewPasswordRecruiter = async (req, res) => {
    try {
        const schema = joi.object({ email, password });
        const { error } = schema.validate(req.body);
        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.createNewPasswordCandidate({ ...req.body })

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}