import db from "../models/index.js";
import { UserRepository } from "../repository/index.js";

export const getMe = async ({ user_id }) =>
    new Promise(async (resolve) => {
        try {
            const user = await db.User.findOne({
                where: { id: user_id },
                include: [
                    {
                        model: db.Role,
                        as: "role",
                        attributes: ["value"],
                    },
                    {
                        model: db.Center,
                        as: "center",
                        attributes: ["center_id", "name", "code", "phone", "email", "website", "description"],
                        required: false,
                    },
                ],
            });
            if (!user) throw new Error("User not found");
            resolve({ err: 0, mes: "Get profile success", data: user });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const updateMe = async ({ user_id, payload }) =>
    new Promise(async (resolve) => {
        try {
            const allowed = {};
            if (typeof payload?.name === "string") allowed.name = payload.name;
            if (typeof payload?.avatar_url === "string") allowed.avatar_url = payload.avatar_url;

            const userRepo = new UserRepository();
            await userRepo.updateUser(user_id, allowed);

            const updated = await db.User.findOne({
                where: { id: user_id },
                include: [
                    {
                        model: db.Role,
                        as: "role",
                        attributes: ["value"],
                    },
                ],
            });

            resolve({ err: 0, mes: "Update profile success", data: updated });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

