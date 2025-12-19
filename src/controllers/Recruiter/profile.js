import * as services from '../../service/index.js'
import { getRecruiterId } from '../../helpers/check_user.js';

export const updateRecruiterProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const payload = req.body;
        if (!id) return res.status(400).json({ 
            err: 1, 
            msg: 'An error occurred, please try again later' 
        });
        const response = await services.updateRecruiterProfile(id, payload);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            msg: 'An error occurred, please try again later' + error
        })
    }
}

export const getRecruiterProfile = async (req, res) => {
    try {
        const recruiter_id = getRecruiterId(req, res);
        if (!recruiter_id) return;
        const response = await services.getRecruiterProfile(recruiter_id);
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            mes: 'An error occurred, please try again later'
        });
    }
}
