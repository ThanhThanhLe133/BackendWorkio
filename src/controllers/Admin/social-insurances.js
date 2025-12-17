import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getAdminId } from '../../helpers/check_user.js'

export const getSocialInsurances = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { identify_number } = req.query;
        if (!identify_number) {
            return res.status(400).json({
                err: 1,
                mes: "Missing identify_number"
            });
        }

        const response = await services.getSocialInsurances({
            identify_number
        });

        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const countUnemploymentBenefits = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const { identify_number } = req.query;
        if (!identify_number) {
            return res.status(400).json({
                err: 1,
                mes: "Missing identify_number"
            });
        }

        const response = await services.countUnemploymentBenefits({
            identify_number
        });

        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
