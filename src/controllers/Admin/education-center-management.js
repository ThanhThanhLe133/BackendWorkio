import * as services from '../../service/index.js';
import { internalServerError, badRequest } from '../../middleWares/handle_error.js';
import joi from 'joi';

const educationCenterSchema = joi.object({
    name: joi.string().required(),
    description: joi.string(),
    address: joi.object({
        province_code: joi.string().required(),
        ward_code: joi.string(),
        street: joi.string(),
    }),
    phone: joi.string(),
    email: joi.string().email(),
    website: joi.string().uri(),
});

export const createEducationCenter = async (req, res) => {
    try {
        const { error } = educationCenterSchema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        const response = await services.createEducationCenter(req.body);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getAllEducationCenters = async (req, res) => {
    try {
        const response = await services.getAllEducationCenters();
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const getEducationCenterById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.getEducationCenterById(id);
        if (response.err === 1) {
            return res.status(404).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateEducationCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = educationCenterSchema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        const response = await services.updateEducationCenter(id, req.body);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const deleteEducationCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await services.deleteEducationCenter(id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
