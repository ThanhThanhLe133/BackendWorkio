import * as services from '../../service/index.js';
import { internalServerError } from '../../middleWares/handle_error.js';
import { getCenterId } from '../../helpers/check_user.js';

export const getCenterStatistics = async (req, res) => {
    try {
        const center_id = getCenterId(req, res);
        if (!center_id) return;

        const response = await services.getCenterStatistics({ center_id });
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
