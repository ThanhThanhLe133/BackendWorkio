import * as services from "../service/index.js";
import { internalServerError, badRequest } from "../middleWares/handle_error.js";

export const getMe = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) return badRequest("Missing user id", res);

        const response = await services.getMe({ user_id });
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const updateMe = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) return badRequest("Missing user id", res);

        const payload = req.body || {};
        const response = await services.updateMe({ user_id, payload });
        if (response.err === 1) return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

