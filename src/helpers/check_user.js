
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
    return admin_id;
};

export const getCandidateId = (req, res) => {
    const recruiter_id = req.user?.id;
    if (!recruiter_id) {
        res.status(400).json({ err: 1, mes: 'Candidate is required' });
        return null;
    }
    return admin_id;
};