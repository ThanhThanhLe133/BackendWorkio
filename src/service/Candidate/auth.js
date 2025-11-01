import { CandidateAuthBuilder } from '../../builder/index.js'

export const verifiedCallBackCandidate = async (token) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateAuthBuilder()
            .setToken(token)

        const result = await builder.verifiedCallBackCandidate();
        resolve(result);

    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const loginCandidate = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const builder = new CandidateAuthBuilder()
                .setEmail(email)
                .setPassword(password)

            const result = await builder.loginCandidate();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateAuthBuilder()
            .setRefreshToken(refresh_token)

        const result = await builder.refreshToken();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
})

export const forgotPasswordCandidate = async ({ email }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateAuthBuilder()
            .setEmail(email)
        const result = await builder.forgotPasswordCandidate();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const resetPasswordCandidate = async ({ token }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateAuthBuilder()
            .setToken(token)

        const result = await builder.resetPasswordCandidate();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});


export const createNewPasswordCandidate = async ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateAuthBuilder()
            .setEmail(email)
            .setNewPassword(password)

        const result = await builder.createNewPassword();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});


export const logoutCandidate = ({ user_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CandidateAuthBuilder()
            .setUserId(user_id)

        const result = await builder.logout();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});