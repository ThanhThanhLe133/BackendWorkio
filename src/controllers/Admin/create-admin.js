import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password } from '../../helpers/joi_schema.js'
import joi from 'joi'

export const accountAdmin = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate({
            email: req.body.email,
            password: req.body.password
        });

        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.accountAdmin(req.body)

        return res.status(200).json(response)
    } catch (error) {
        console.log(error);

        return internalServerError(res)
    }
}