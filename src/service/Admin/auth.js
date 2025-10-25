import db from '../../models/index.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { hashPassword, sendResetPasswordEmail } from '../../helpers/fn.js';
dotenv.config();

export const loginAdmin = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email },
                include: [
                    // {
                    //     model: db.Candidate,
                    //     as: 'admin',
                    // },
                    {
                        model: db.Role,
                        as: 'role',
                        attributes: ['value'],
                    },
                ],
            });

            if (!user) return { err: 1, mes: 'User not found' };

            if (!user.role || user.role.value !== 'Admin') {
                return resolve({
                    err: 1,
                    mes: 'You do not have permission to log in as admin',
                });
            }

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

export const forgotPasswordAdmin = async ({ email }) => {
    try {
        const user = await db.User.findOne({
            where: { email }, include: [
                {
                    model: db.Role,
                    as: 'role',
                    attributes: ['value'],
                },
            ],
        });
        if (!user) {
            return { err: 1, mes: 'Email not found in system' };
        }
        if (!user.role || user.role.value !== 'Admin') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as admin',
            };
        }
        const token = jwt.sign(
            { email },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: '1h' }
        );
        await sendResetPasswordEmail(email, token, 'Admin');

        return {
            err: 0,
            mes: 'Password reset link sent to your email. Please check your inbox.',
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const resetPasswordAdmin = async ({ token }) => {
    try {
        if (!token) {
            return { err: 1, mes: 'Missing token' };
        }

        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
        const email = decoded.email;

        const user = await db.User.findOne({
            where: { email }, include: [
                {
                    model: db.Role,
                    as: 'role',
                    attributes: ['value'],
                },
            ],
        });
        if (!user) {
            return { err: 1, mes: 'User not found' };
        }
        if (!user.role || user.role.value !== 'Admin') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as admin',
            };
        }
        return {
            err: 0,
            mes: 'Token verified successfully',
            email,
        };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { err: 1, mes: 'Reset password link expired. Please request a new one.' };
        }
        console.error('Reset password error:', error);
        return { err: 1, mes: 'Invalid or expired token' };
    }
};


export const createNewPasswordAdmin = async ({ email, password }) => {
    try {
        if (!email || !password) {
            return { err: 1, mes: 'Missing email or password' };
        }

        const user = await db.User.findOne({
            where: { email }, include: [
                {
                    model: db.Role,
                    as: 'role',
                    attributes: ['value'],
                },
            ],
        });
        if (!user) {
            return { err: 1, mes: 'User not found' };
        }
        if (!user.role || user.role.value !== 'Admin') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as admin',
            };
        }

        const hashedPassword = hashPassword(password);
        await user.update({ password: hashedPassword });

        return {
            err: 0,
            mes: 'Password has been reset successfully',
        };
    } catch (error) {
        console.error('Create new password error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};