import * as services from '../../service/index.js';
import { internalServerError, badRequest } from '../../middleWares/handle_error.js';
import { candidateEditProfileSchema } from '../../helpers/joi_schema.js';

export const editProfile = async (req, res) => {
    try {
        // 1. Lấy userId từ token
        const userId = req.user.id;

        if (req.body.gender) {
            const g = req.body.gender.toLowerCase();
            req.body.gender = g.charAt(0).toUpperCase() + g.slice(1);
        }

        // 2. Validate body 
        const { error } = candidateEditProfileSchema.validate(req.body);
        if (error) {
            return badRequest(error.details[0]?.message, res);
        }

        // 3. Gọi service 
        const response = await services.editCandidateProfile({
            userId,
            payload: req.body
        });

        return res.status(200).json(response);

    } catch (error) {
        console.error("Controller Error:", error);
        return internalServerError(res);
    }
};