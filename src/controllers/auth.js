import * as services from '../service/index.js'
import { internalServerError, badRequest } from '../middleWares/handle_error.js'
import { email, password, refresh_token } from '../helpers/joi_schema.js'
import joi from 'joi'

export const register = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate(req.body)
        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.register(req.body)

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}
export const login = async (req, res) => {
    try {
        // const { email, password } = req.body
        // if (!email || !password) {
        //     return res.status(400).json({
        //         err: 1,
        //         mes: 'missing payloads'
        //     })
        // }
        const { error } = joi.object({ email, password }).validate(req.body)
        //req.body: lấy dữ liệu trong body của request + cần gửi nhiều dữ liệu phức tạp (JSON hoặc form data).
        //Thường dùng với các phương thức POST, PUT, PATCH, DELETE -> đăng ký, thêm mới, cập nhật
        if (error)
            return badRequest(error.details[0]?.message, res)
        const response = await services.login(req.body)

        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const refreshTokenController = async (req, res) => {
    try {
        const { error } = joi.object({ refresh_token }).validate(req.body)

        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.refreshToken(req.body.refresh_token);

        return res.status(200).json(response)
    } catch (error) {
        console.error('Error in refreshTokenController: ', error);
        return internalServerError(res)
    }
}