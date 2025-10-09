import pkg from 'jsonwebtoken';
import { notAuth } from './handle_error.js';

const { verify, TokenExpiredError } = pkg;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return notAuth('Require authorization!', res);

    const access_token = authHeader.split(' ')[1];
    if (!access_token) return notAuth('Invalid token format!', res);

    verify(access_token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const isExpired = err instanceof TokenExpiredError;
            if (isExpired) return notAuth('Access token expired', res, true);
            return notAuth('Access token invalid', res, false);
        }

        req.user = user;
        next();
    });
};

export default verifyToken;
