import * as services from '../../service/index.js';
import { internalServerError } from '../../middleWares/handle_error.js';

export const getTrainingFields = async (req, res) => {
    try {
        const response = await services.getTrainingFields();
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
