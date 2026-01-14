import { CenterAuthBuilder } from "../../builder/index.js";

export const loginCenter = ({ email, password }) =>
    new Promise(async (resolve) => {
        try {
            const builder = new CenterAuthBuilder()
                .setEmail(email)
                .setPassword(password);

            const result = await builder.loginCenter();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const forgotPasswordCenter = async ({ email }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CenterAuthBuilder()
            .setEmail(email);

        const result = await builder.forgotPasswordCenter();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const resetPasswordCenter = async ({ password, token }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CenterAuthBuilder()
            .setNewPassword(password)
            .setToken(token);

        const result = await builder.resetPasswordCenter();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const createNewPasswordCenter = async ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CenterAuthBuilder()
            .setEmail(email)
            .setNewPassword(password);

        const result = await builder.createNewPassword();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const logoutCenter = ({ user_id }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new CenterAuthBuilder()
            .setUserId(user_id);

        const result = await builder.logout();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

