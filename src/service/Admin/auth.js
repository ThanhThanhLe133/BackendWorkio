import db from '../../models/index.js'
import bcrypt from "bcryptjs"
import { google } from 'googleapis';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();

export const loginAdmin = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email },
                include: [
                    {
                        model: db.Candidate,
                        as: 'admin',
                    },
                ],
            });

            if (!user) return { err: 1, mes: 'User not found' };

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) return { err: 1, mes: 'Invalid password' };

            const access_token = jwt.sign(
                { id: user.id, email: user.email, role: user.role_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const refresh_token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET_REFRESH,
                { expiresIn: '7d' }
            );

            await user.update({ refresh_token });

            resolve({
                err: 0,
                mes: 'Login successfully',
                access_token: `Bearer ${access_token}`,
                refresh_token,
                data: user,
            });
        } catch (error) {
            console.error('Login error:', error);
            reject(error);
        }
    });