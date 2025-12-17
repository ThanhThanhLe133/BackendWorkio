import { AdminAuthBuilder } from '../../builder/index.js'

export const loginAdmin = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const builder = new AdminAuthBuilder()
                .setEmail(email)
                .setPassword(password)
            const result = await builder.loginAdmin();
            resolve(result);;
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const forgotPasswordAdmin = async ({ email }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new AdminAuthBuilder()
            .setEmail(email)

        const result = await builder.forgotPasswordAdmin();
        resolve(result);;
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});


export const createNewPasswordAdmin = async ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new AdminAuthBuilder()
            .setEmail(email)
            .setNewPassword(password)

        const result = await builder.createNewPassword();
        resolve(result);;
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});


export const logoutAdmin = ({ user_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new AdminAuthBuilder()
            .setUserId(user_id)

        const result = await builder.logout();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
