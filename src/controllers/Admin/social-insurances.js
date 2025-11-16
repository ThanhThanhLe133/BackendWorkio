import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getAdminId } from '../../helpers/check_user.js'

export const getSocialInsurances = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const candidate_id = req.query;
        if (!candidate_id) {
            return res.status(400).json({
                err: 1,
                mes: "Missing candidate_id"
            });
        }

        const response = await services.getSocialInsurances({
            candidate_id: candidate_id
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

        const candidate_id = req.query;

        if (!candidate_id) {
            return res.status(400).json({
                err: 1,
                mes: "Missing candidate_id"
            });
        }

        const response = await services.countUnemploymentBenefits({
            candidate_id: candidate_id
        });

        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

