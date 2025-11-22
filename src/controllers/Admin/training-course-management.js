import * as services from '../../service/index.js';
import { internalServerError, badRequest } from '../../middleWares/handle_error.js';
import joi from 'joi';

const trainingCourseSchema = joi.object({
    center_id: joi.string().uuid().required(),
    title: joi.string().required(),
    description: joi.string(),
    field_id: joi.number().integer(),
    start_date: joi.date(),
    end_date: joi.date(),
    duration: joi.string(),
    tuition_fee: joi.number(),
    status: joi.string(),
});

export const createTrainingCourse = async (req, res) => {
    try {
        const { error } = trainingCourseSchema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        const response = await services.createTrainingCourse(req.body);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getAllTrainingCourses = async (req, res) => {
    try {
        const response = await services.getAllTrainingCourses(req.query);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getTrainingCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.getTrainingCourseById(id);
        if (response.err === 1) {
            return res.status(404).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateTrainingCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = trainingCourseSchema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        const response = await services.updateTrainingCourse(id, req.body);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteTrainingCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.deleteTrainingCourse(id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
