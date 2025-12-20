import * as services from '../../service/index.js';
import { internalServerError, badRequest } from '../../middleWares/handle_error.js';
import { getCandidateId } from '../../helpers/check_user.js';

export const getRecruiterDetailCandidate = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;

        const { recruiter_id } = req.query;
        if (!recruiter_id) return badRequest('Missing recruiter_id', res);

        const response = await services.getRecruiterDetailCandidate(recruiter_id);
        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};
