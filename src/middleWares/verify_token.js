import pkg from "jsonwebtoken";
import { notAuth } from "./handle_error.js";
import db from "../models/index.js";
const { verify, TokenExpiredError } = pkg;

export const verifyTokenCandidate = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return notAuth("Require authorization!", res);
    const access_token = token.split(" ")[1];

    verify(access_token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return notAuth("Access token expired", res, true);
            }
            return notAuth("Access token invalid", res, false);
        }
        const user = await findUserById(decoded.id);
        if (!user) return notAuth("User not found", res);

        if (user.role?.value !== "Candidate") {
            return notAuth(
                "You do not have the required role to access this resource",
                res,
            );
        }

        // Check if user has candidate record
        if (!user.candidate) {
            return notAuth("Candidate account not found", res);
        }

        req.user = user;
        next();
    });
};

export const verifyTokenRecruiter = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return notAuth("Require authorization!", res);
    const access_token = token.split(" ")[1];

    verify(access_token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return notAuth("Access token expired", res, true);
            }
            return notAuth("Access token invalid", res, false);
        }
        const user = await findUserById(decoded.id);
        if (!user) return notAuth("User not found", res);

        if (user.role?.value !== "Recruiter") {
            return notAuth(
                "You do not have the required role to access this resource",
                res,
            );
        }

        // Check if user has recruiter record
        if (!user.recruiter) {
            return notAuth("Recruiter account not found", res);
        }

        req.user = user;
        next();
    });
};

export const verifyTokenCenter = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return notAuth("Require authorization!", res);
    const access_token = token.split(" ")[1];

    verify(access_token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return notAuth("Access token expired", res, true);
            }
            return notAuth("Access token invalid", res, false);
        }
        const user = await findUserById(decoded.id);
        if (!user) return notAuth("User not found", res);

        if (user.role?.value !== "Center") {
            return notAuth(
                "You do not have the required role to access this resource",
                res,
            );
        }

        // Check if user has center record
        if (!user.center) {
            return notAuth("Center account not found", res);
        }

        // Check if center account is active
        if (user.center.is_active === false) {
            return notAuth("Tài khoản trung tâm đang bị khóa", res);
        }

        req.user = user;
        next();
    });
};

export const verifyTokenAdmin = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return notAuth("Require authorization!", res);
    const access_token = token.split(" ")[1];

    verify(access_token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return notAuth("Access token expired", res, true);
            }
            return notAuth("Access token invalid", res, false);
        }
        const user = await findUserById(decoded.id);
        if (!user) return notAuth("User not found", res);

        if (user.role?.value !== "Admin") {
            return notAuth(
                "You do not have the required role to access this resource",
                res,
            );
        }

        // Check if user has admin record
        if (!user.admin) {
            return notAuth("Admin account not found", res);
        }

        req.user = user;
        next();
    });
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return notAuth("Require authorization!", res);

    const access_token = authHeader.split(" ")[1];
    if (!access_token) return notAuth("Invalid token format!", res);

    verify(access_token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            const isExpired = err instanceof TokenExpiredError;
            if (isExpired) return notAuth("Access token expired", res, true);
            return notAuth("Access token invalid", res, false);
        }

        const user = await findUserById(decoded.id);
        if (!user) return notAuth("User not found", res);

        req.user = user;
        next();
    });
};

const findUserById = async (userId) => {
    try {
        const user = await db.User.findOne({
            where: { id: userId },
            include: [
                {
                    model: db.Role,
                    as: "role",
                    attributes: ["value"],
                },
                {
                    model: db.Admin,
                    as: "admin",
                    attributes: ["admin_id"],
                },
                {
                    model: db.Candidate,
                    as: "candidate",
                    attributes: ["candidate_id"],
                },
                {
                    model: db.Recruiter,
                    as: "recruiter",
                    attributes: ["recruiter_id"],
                },
                {
                    model: db.Center,
                    as: "center",
                    attributes: ["center_id", "is_active"],
                },
            ],
        });
        return user;
    } catch (error) {
        console.error("Error finding user by ID:", error);
        throw error;
    }
};
