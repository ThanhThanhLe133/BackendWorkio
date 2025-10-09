import { notAuth } from "./handle_error.js";
const ROLE_ADMIN = 'R1';
const ROLE_MODERATOR = 'R2';

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role_code !== ROLE_ADMIN) {
        return notAuth('Require role Admin', res);
    }
    next()
}
export const isModerator = (req, res, next) => {
    if (!req.user || req.user.role_code !== ROLE_MODERATOR) {
        return notAuth('Require role Moderator', res);
    }
    next()
}
