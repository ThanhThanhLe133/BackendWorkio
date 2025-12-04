import * as services from '../../service/index.js'

export const getAdminProfile = async (req, res) => {
    try {
        const { id } = req.user
        const result = await services.getAdminProfile(id)
        return res.status(result.status).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: 'An error occurred, please try again later'
        })
    }
}

export const updateAdminProfile = async (req, res) => {
    try {
        const { id } = req.user
        const data = req.body
        const result = await services.updateAdminProfile(id, data)
        return res.status(result.status).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: 'An error occurred, please try again later'
        })
    }
}