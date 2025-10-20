import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password, refresh_token } from '../../helpers/joi_schema.js'
import joi from 'joi'
import jwt from 'jsonwebtoken'

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

export const verifiedCallBack = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ err: 1, mes: 'Missing token parameter' });
        }

        const response = await services.verifiedCallBack(token);

        return res.status(200).json(response)
        // return res.redirect(
        //     `${process.env.CLIENT_URL}/auth/verify-failed?reason=${encodeURIComponent(result.mes)}`
        // );
    } catch (error) {
        console.log(error);

        return internalServerError(res)
    }
}

export const login = async (req, res) => {
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
        const response = await services.login({ ...req.body })

        return res.status(200).json(response)
    } catch (error) {
        console.log(error);

        return internalServerError(res)
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { error } = joi.object({ refresh_token }).validate(req.body)

        if (error)
            return badRequest(error.details[0]?.message, res)

        const response = await services.refreshToken(req.body.refresh_token);

        return res.status(200).json(response)
    } catch (error) {
        console.error('Error in refreshToken: ', error);
        return internalServerError(res)
    }
}

export const googleLogin = async (req, res) => {
    try {
        const result = await services.googleLogin();
        if (result.err) return res.status(400).json(result);
        return res.redirect(result.data);

    } catch (error) {
        console.error('Logout controller error:', error);
        return res.status(500).json({ err: 1, mes: 'Internal Server Error' });
    }
};

export const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).json({ err: 1, mes: 'Missing code parameter' });

        const result = await services.googleCallBack(code);

        if (result.err) return res.status(500).json(result);

        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Google callback controller error:', error);
        return res.status(500).json({ err: 1, mes: 'Internal Server Error' });
    }
};


export const logout = async (req, res) => {
    try {
        const user_id = req.user?.id;

        if (!user_id) return badRequest('Missing user id', res);

        const response = await services.logout({ user_id });
        if (response.err !== 0) {
            return res.status(401).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error('Logout controller error:', error);
        return internalServerError(res)
    }
};