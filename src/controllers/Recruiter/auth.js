import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'

export const registeRecruiter = async (req, res) => {
    try {
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(6).required(),
            company_name: joi.string().required(),
            province_code: joi.string().required(),
            ward_code: joi.string().required(),
            street: joi.string().required(),
            tax_number: joi.string().required(),
            phone: joi.string().required(),
            website: joi.string().allow('', null),
            description: joi.string().allow('', null),
            documents: joi.any()
        });

        const { error, value } = schema.validate(req.body);
        if (error) return badRequest(error.details[0]?.message, res);

        const files = req.files?.documents || [];

        const ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"];
        for (const file of files) {
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                return badRequest(`File type not allowed: ${file.originalname}`, res);
            }
        }
        const response = await services.registeRecruiter({
            ...value,
            documents: files
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
