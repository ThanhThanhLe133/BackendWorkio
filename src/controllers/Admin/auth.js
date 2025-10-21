import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
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
