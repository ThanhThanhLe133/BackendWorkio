
export const getAdminId = (req, res) => {
    const admin_id = req.user?.id;
    if (!admin_id) {
        res.status(400).json({ err: 1, mes: 'Admin is required' });
        return null;
    }
    return admin_id;
};

export const getRecruiterId = (req, res) => {
    const recruiter_id = req.user?.id;
    if (!recruiter_id) {
        res.status(400).json({ err: 1, mes: 'Recruiter is required' });
        return null;
    }
    return recruiter_id;
};

export const getCandidateId = (req, res) => {
    const candidate_id = req.user?.id;
    if (!candidate_id) {
        res.status(400).json({ err: 1, mes: 'Candidate is required' });
        return null;
    }
    return candidate_id;
};

export const getCenterId = (req, res) => {
    const center_id = req.user?.id;
    if (!center_id) {
        res.status(400).json({ err: 1, mes: 'Center is required' });
        return null;
    }
    return center_id;
};
