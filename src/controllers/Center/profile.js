import * as services from '../../service/index.js'
import { getCenterId } from '../../helpers/check_user.js';

export const updateCenterProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const payload = req.body;
        if (!id) return res.status(400).json({ 
            err: 1, 
            msg: 'Đã xảy ra lỗi, vui lòng thử lại sau' 
        });
        const response = await services.updateCenterProfile(id, payload);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            msg: 'Đã xảy ra lỗi, vui lòng thử lại sau' + error
        })
    }
}

export const getCenterProfile = async (req, res) => {
    try {
        const center_id = getCenterId(req, res);
        if (!center_id) return;
        const response = await services.getCenterProfile(center_id);
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: -1,
            mes: 'Đã xảy ra lỗi, vui lòng thử lại sau'
        });
    }
}
