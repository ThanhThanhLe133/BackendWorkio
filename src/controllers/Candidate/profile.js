import * as services from '../../service/index.js'

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

export const updateCandidateAvatar = async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) return res.status(400).json({ err: 1, msg: 'Unauthorized' });
        if (!req.file) return res.status(400).json({ err: 1, msg: 'No file uploaded. Expect field name "avatar".' });

        const response = await services.updateCandidateAvatar(id, req.file);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: -1, msg: 'An error occurred, please try again later' });
    }
}
