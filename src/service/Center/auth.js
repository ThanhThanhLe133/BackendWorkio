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

