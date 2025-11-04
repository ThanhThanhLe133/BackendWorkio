import { AdminAuthBuilder } from '../../builder/index.js'

export const accountAdmin = ({ email, password, name }) => new Promise(async (resolve, reject) => {
    try {
        const builder = new AdminAuthBuilder()
            .setEmail(email)
            .setPassword(password)
            .setName(name)

        const result = await builder.createAccountAdmin();
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
})