import db from '../../models/index.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { v4 as UUIDV4 } from "uuid";
import supabase from "../../config/supabaseClient.js";
import dotenv from "dotenv";
import { hashPassword } from '../../helpers/fn.js';
dotenv.config();

export const registerRecruiter = ({ email, password, company_name, province_code, ward_code, street, tax_number, phone, documents, }) =>
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
                website,
                description,
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
                ],
            });

            if (!user) return { err: 1, mes: 'User not found' };

            if (!user.recruiter.is_verified) {
                return { err: 1, mes: 'Please verify your email before logging in.' };
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

