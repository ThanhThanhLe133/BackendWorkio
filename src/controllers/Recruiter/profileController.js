import { recruiterEditProfileSchema } from '../../helpers/joi_schema.js';
import * as services from '../../service/Recruiter/profile.js';

export const editProfile = async (req, res) => {
    try {
        // 1. Lấy userId từ token 
        const userId = req.user.id;

        // 2. Validate dữ liệu body
        const { error } = recruiterEditProfileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                err: 1,
                mes: error.details[0].message
            });
        }

        // 3. Gọi service 
        const response = await services.editRecruiterProfile({
            userId,
            payload: req.body
        });

        return res.status(200).json(response);

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            err: -1,
            mes: 'Internal Server Error'
        });
    }
};