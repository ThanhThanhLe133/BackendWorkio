import * as services from '../../service/index.js';
import { internalServerError, badRequest } from '../../middleWares/handle_error.js';
import joi from 'joi';
import { getAdminId } from '../../helpers/check_user.js';

const courseEnrollmentSchema = joi.object({
    course_id: joi.string().uuid().required(),
    candidate_id: joi.string().uuid().required(),
    status: joi.string(),
    result_score: joi.number(),
    notes: joi.string(),
});

export const createCourseEnrollment = async (req, res) => {
    try {
        const { error } = courseEnrollmentSchema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const response = await services.createCourseEnrollment({ ...req.body, assigned_by_admin_id: admin_id });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getAllCourseEnrollments = async (req, res) => {
    try {
        const response = await services.getAllCourseEnrollments(req.query);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getCourseEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.getCourseEnrollmentById(id);
        if (response.err === 1) {
            return res.status(404).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateCourseEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = courseEnrollmentSchema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        const response = await services.updateCourseEnrollment(id, req.body);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteCourseEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.deleteCourseEnrollment(id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
