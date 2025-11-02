import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import { getCandidateId } from '../../helpers/check_user.js'

export const applyJobCandidate = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;

        const response = await services.applyJobCandidate({ candidate_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllJobPostsCandidate = async (req, res) => {
    try {
        const response = await services.getAllJobPostsCandidate();

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const getAllPostsOfCandidateCandidate = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;
        const response = await services.getAllPostsOfCandidateCandidate({ candidate_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const filterJobsByFieldsCandidate = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;
        const fields = { ...req.body };
        const response = await services.filterJobsByFieldsCandidate({ fields });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}

export const suggestJobsForCandidate = async (req, res) => {
    try {
        const candidate_id = getCandidateId(req, res);
        if (!candidate_id) return;
        const response = await services.suggestJobsForCandidate({ candidate_id });

        if (response.err === 1) {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
}
