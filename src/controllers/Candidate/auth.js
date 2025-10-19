import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { email, password, refresh_token } from '../../helpers/joi_schema.js'
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

export const verifiedCallBack = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ err: 1, mes: 'Missing email parameter' });
        }

        if (result.err === 0) {
            res.cookie('access_token', result.access_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie('refresh_token', result.refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.redirect(`${process.env.CLIENT_URL}/auth/success`);
        }

        return res.redirect(
            `${process.env.CLIENT_URL}/auth/verify-failed?reason=${encodeURIComponent(result.mes)}`
        );
    } catch (error) {
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
        return res.redirect(result.url);
    } catch (error) {
        console.error('Logout controller error:', error);
        return res.status(500).json({ err: 1, mes: 'Internal Server Error' });
    }
};

export const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ err: 1, mes: 'Missing code parameter' });
        }

        const result = await services.googleCallBack(code);

        if (result.err === 0) {
            res.cookie('access_token', result.access_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie('refresh_token', result.refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.redirect(`${process.env.CLIENT_URL}/auth/success`);
        }

        return res.redirect(
            `${process.env.CLIENT_URL}/auth/verify-failed?reason=${encodeURIComponent(result.mes)}`
        );
    } catch (error) {
        console.error('Google callback error:', error);
        return internalServerError(res);
    }
};

export const logout = async (req, res) => {
    try {
        const refresh_token =
            req.cookies?.refresh_token || req.body.refresh_token || req.query.refresh_token;

        const result = await services.logout(refresh_token);

        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return res.status(result.err ? 400 : 200).json(result);
    } catch (error) {
        console.error('Logout controller error:', error);
        return internalServerError(res)
    }
};