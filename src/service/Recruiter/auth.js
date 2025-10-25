import db from '../../models/index.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { v4 as UUIDV4 } from "uuid";
import supabase from "../../config/supabaseClient.js";
import dotenv from "dotenv";
import { hashPassword, sendResetPasswordEmail } from '../../helpers/fn.js';
dotenv.config();

export const registerRecruiter = ({ email, password, company_name, province_code, ward_code, street, tax_number, phone, documents, description }) =>
    new Promise(async (resolve, reject) => {
        try {
            const exist = await db.User.findOne({ where: { email } });
            if (exist) return resolve({ err: 1, mes: 'Email already registered' });

            const role = await db.Role.findOne({ where: { value: 'Recruiter' } });
            if (!role) return resolve({ err: 1, mes: 'Recruiter role not found' });

            const hashed = hashPassword(password);
            const user = await db.User.create({
                email,
                password: hashed,
                isVerified: false,
                role_id: role.id,
            });

            const address = await db.Address.create({
                province_code,
                ward_code,
                street
            });

            await db.Recruiter.create({
                recruiter_id: user.id,
                company_name,
                tax_number,
                phone,
                description: description || null,
                address_id: address.id,
            });

            if (documents && documents.length > 0) {
                for (const file of documents) {
                    const ext = file.originalname.split('.').pop();
                    const filePath = `recruiters/${user.id}_${UUIDV4()}.${ext}`;

                    const { error: uploadError } = await supabase.storage
                        .from('documents')
                        .upload(filePath, file.buffer, {
                            contentType: file.mimetype,
                            upsert: true,
                        });

                    if (uploadError) {
                        return resolve({ err: 1, mes: uploadError.message });
                    }

                    const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
                    if (!data?.publicUrl) {
                        return resolve({ err: 1, mes: 'Failed to get document public URL' });
                    }

                    await db.RecruiterDocument.create({
                        recruiter_id: user.id,
                        type: file.type,
                        issue_date: file.issue_date,
                        expire_date: file.expire_date,
                        file_url: data.publicUrl,
                    });
                }
            }

            return resolve({
                err: 0,
                mes: 'Register successfully. We will send a confirmation email after checking your information.',
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });

export const verifiedCallBackRecruiter = async (token) => {
    try {
        if (!token) {
            return { err: 1, mes: 'Missing token' };
        }
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
        const email = decoded.email;
        if (!email) {
            return { err: 1, mes: 'Invalid token payload' };
        }
        const user = await db.User.findOne({
            where: { email },
            include: [
                {
                    model: db.Recruiter,
                    as: 'recruiter',
                },
            ],
        });

        if (!user) return { err: 1, mes: 'User not found' };

        if (!user.recruiter) {
            return { err: 1, mes: 'Candidate profile not found for this user' };
        }

        if (user.recruiter.is_verified) {
            return { err: 0, mes: 'Email already verified', user };
        }

        await user.recruiter.update({ is_verified: true });

        return {
            err: 0,
            mes: 'Email verified successfully',
            user,
        };
    } catch (error) {
        console.error('verifiedCallBack error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const loginRecruiter = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email },
                include: [
                    {
                        model: db.Recruiter,
                        as: 'recruiter',
                    },
                    {
                        model: db.Role,
                        as: 'role',
                        attributes: ['value'],
                    },
                ],
            });

            if (!user) return { err: 1, mes: 'User not found' };

            if (!user.role || user.role.value !== 'Recruiter') {
                return resolve({
                    err: 1,
                    mes: 'You do not have permission to log in as recruiter',
                });
            }

            if (!user.recruiter.is_verified) {
                return { err: 1, mes: 'Please verify your email before logging in.' };
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) return { err: 1, mes: 'Invalid password' };

            const roleCode = user.role.value;

            const access_token = jwt.sign(
                { id: user.id, email: user.email, role_code: roleCode },
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

export const forgotPasswordRecruiter = async ({ email }) => {
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
        if (!user.role || user.role.value !== 'Recruiter') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as Recruiter',
            };
        }
        const token = jwt.sign(
            { email },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: '1h' }
        );
        await sendResetPasswordEmail(email, token, 'Recruiter');

        return {
            err: 0,
            mes: 'Password reset link sent to your email. Please check your inbox.',
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const resetPasswordRecruiter = async ({ token }) => {
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
        if (!user.role || user.role.value !== 'Recruiter') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as Recruiter',
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


export const createNewPasswordRecruiter = async ({ email, password }) => {
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
        if (!user.role || user.role.value !== 'Recruiter') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as Recruiter',
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