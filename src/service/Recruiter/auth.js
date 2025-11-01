import { RecruiterAuthBuilder } from '../../builder/index.js'

export const verifiedCallBackRecruiter = async (token) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterAuthBuilder()
            .setToken(token)

        const result = await builder.verifiedCallBackrecruiter();
        resolve(result);;
    } catch (error) {
        console.error('verifiedCallBack error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
});

export const loginRecruiter = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const builder = new RecruiterAuthBuilder()
                .setEmail(email)
                .setPassword(password)

            const result = await builder.loginRecruiter();
            resolve(result);;
        } catch (error) {
            console.error('Login error:', error);
            resolve({ err: 1, mes: error.message });
        }
    });

export const forgotPasswordRecruiter = async ({ email }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterAuthBuilder()
            .setEmail(email)

        const result = await builder.forgotPasswordRecruiter();
        resolve(result);;
    } catch (error) {
        console.error('Forgot password error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
});

export const resetPasswordRecruiter = async ({ token }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterAuthBuilder()
            .setToken(token)

        const result = await builder.resetPasswordRecruiter();
        resolve(result);;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { err: 1, mes: 'Reset password link expired. Please request a new one.' };
        }
        console.error('Reset password error:', error);
        return { err: 1, mes: 'Invalid or expired token' };
    }
});


export const createNewPasswordRecruiter = async ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterAuthBuilder()
            .setEmail(email)
            .setPassword(password)

        const result = await builder.createNewPassword();
        resolve(result);;
    } catch (error) {
        console.error('Create new password error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
});

export const logoutRecruiter = ({ user_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterAuthBuilder()
            .setUserId(user_id)

        const result = await builder.logout();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});