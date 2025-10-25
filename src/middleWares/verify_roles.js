import { notAuth } from "./handle_error.js";
const ROLE_ADMIN = 'Admin';
const ROLE_RECRUITER = 'Recruiter';
const ROLE_CANDIDATE = 'Candidate';

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role_code !== ROLE_ADMIN) {
        return notAuth('Require role Admin', res);
    }
    next()
}

export const isRecruiter = (req, res, next) => {
    if (!req.user || req.user.role_code !== ROLE_RECRUITER) {
        return notAuth('Require role Recruiter', res);
    }
    next()
}

export const isCandidate = (req, res, next) => {
    if (!req.user || req.user.role_code !== ROLE_CANDIDATE) {
        return notAuth('Require role Candidate', res);
    }
    next()
}
