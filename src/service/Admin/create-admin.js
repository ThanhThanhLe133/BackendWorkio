import db from '../../models/index.js'
import { hashPassword } from '../../helpers/fn.js';

export const accountAdmin = ({ email, password, name }) => new Promise(async (resolve, reject) => {
    try {
        const [role] = await db.Role.findOrCreate({
            where: { value: 'Admin' }
        });

        const [user, created] = await db.User.findOrCreate({
            where: { email, role_id: role.id },
            raw: true,
            defaults: {
                email,
                active_status: false,
                password: hashPassword(password),
                name
            }
        });

        if (!created) {
            return resolve({
                err: 1,
                mes: "Phone number already exists with Admin role."
            });
        }

        await db.Admin.create({
            admin_id: user.id,
        });

        resolve({
            err: 0,
            mes: 'Create admin successfully',
        });
    } catch (error) {
        reject(error)
    }
})