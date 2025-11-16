import * as services from '../../service/index.js'

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
