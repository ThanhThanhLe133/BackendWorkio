import { UserRepository } from '../../repository/index.js'

export const getAdminProfile = async (user_id) => {
    try {
        const userRepository = new UserRepository()
        const user = await userRepository.getById(user_id)
        return {
            status: 200,
            message: 'Get profile success',
            data: user
        }
    } catch (error) {
        return {
            status: 500,
            message: `Service error: ${error.message}`
        }
    }
}

export const updateAdminProfile = async (user_id, data) => {
    try {
        const userRepository = new UserRepository()
        await userRepository.updateUser(user_id, data)
        return {
            status: 200,
            message: 'Update success'
        }
    } catch (error) {
        return {
            status: 500,
            message: `Service error: ${error.message}`
        }
    }
}