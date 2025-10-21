import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'

export const getAllRecruitersAdmin = async (req, res) => {
    try {
        const admin_id = req.user?.id;
        if (!admin_id) {
            return res.status(400).json({ err: 1, mes: 'AdminId is required' });
        }
        const response = await services.getAllRecruitersAdmin();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return internalServerError(res)
    }
}

export const sendEmailToRecruiter = async (req, res) => {
    try {
        const admin_id = req.user?.id;
        if (!admin_id) {
            return res.status(400).json({ err: 1, mes: 'AdminId is required' });
        }
        const { recruiter_id } = req.query;
        const response = await services.sendEmailToRecruiter({
            admin_id, recruiter_id
        });
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);

        return internalServerError(res)
    }
}