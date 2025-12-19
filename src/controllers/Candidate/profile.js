import * as services from '../../service/index.js'
import { getCandidateId } from '../../helpers/check_user.js';

export const updateCandidateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const payload = req.body;
        if (!id) return res.status(400).json({ 
            err: 1, 
            msg: 'An error occurred, please try again later' 
        });
        const response = await services.updateCandidateProfile(id, payload);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            msg: 'An error occurred, please try again later' + error
        })
    }
}

export const getCandidateProfile = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;
        const response = await services.getCandidateProfile(candidate_id);
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
