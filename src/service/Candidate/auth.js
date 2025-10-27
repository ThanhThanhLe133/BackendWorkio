import db from '../../models/index.js'
import bcrypt from "bcryptjs"
import { google } from 'googleapis';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { sendVerificationEmail, hashPassword, sendResetPasswordEmail } from '../../helpers/fn.js';
dotenv.config();

export const registerCandidate = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const exist = await db.User.findOne({ where: { email } });
            if (exist) return resolve({ err: 1, mes: 'Email already registered' });

            const role = await db.Role.findOne({ where: { value: 'Candidate' } });
            if (!role) return resolve({ err: 1, mes: 'Candidate role not found' });

            const hashed = hashPassword(password);
            const user = await db.User.create({
                email,
                password: hashed,
                isVerified: false,
                role_id: role.id,
            });

            const token = jwt.sign(
                { email },
                process.env.EMAIL_VERIFY_SECRET,
                { expiresIn: '1d' }
            );

            await sendVerificationEmail(email, token, 'Candidate');

            await db.Candidate.create({
                candidate_id: user.id,
                resume_url: null,
                gender: null,
                address: null,
                dob: null,
            });

            return resolve({
                err: 0,
                mes: 'Register successfully. Please check your email to confirm.',
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
export const verifiedCallBackCandidate = async (token) => {
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
                    model: db.Candidate,
                    as: 'candidate',
                },
            ],
        });

        if (!user) return { err: 1, mes: 'User not found' };

        if (!user.candidate) {
            return { err: 1, mes: 'Candidate profile not found for this user' };
        }

        if (user.candidate.is_verified) {
            return { err: 0, mes: 'Email already verified', user };
        }

        await user.candidate.update({ is_verified: true });

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

export const loginCandidate = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email },
                include: [
                    {
                        model: db.Candidate,
                        as: 'candidate',
                    },
                    {
                        model: db.Role,
                        as: 'role',
                        attributes: ['value'],
                    },
                ],
            });

            if (!user) return { err: 1, mes: 'User not found' };

            if (!user.role || user.role.value !== 'Candidate') {
                return resolve({
                    err: 1,
                    mes: 'You do not have permission to log in as candidate',
                });
            }

            if (!user.candidate.is_verified) {
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

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { refresh_token },
            raw: true
        })
        if (response) {
            jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH, (err) => {
                if (err) {
                    resolve({
                        err: 1,
                        mes: 'Refresh token expired. Require login.'
                    })
                }
                else {
                    const access_token = jwt.sign({
                        id: response.id,
                        email: response.email,
                        role_id: response.role_id
                    },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' })

                    resolve({
                        err: access_token ? 0 : 1,
                        mes: access_token ? 'OK' : 'Fail to generate new access token. Try later',
                        'access_token': access_token ? `Bearer ${access_token}` : null,
                        'refresh_token': refresh_token
                    })
                }
            })
        }
    } catch (error) {
        reject(error)
    }
})

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/candidate/auth/google-callback'
);

export const googleLogin = async () => {
    try {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes,
        });
        console.log(url);
        return {
            err: 0,
            mes: 'Redirect to Google OAuth',
            data: url,
        };
    } catch (error) {
        console.error('Google login error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const googleCallBack = async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();

        const { email, name } = data;

        let user = await db.User.findOne({ where: { email } });

        if (!user) {
            user = await db.User.create({
                email,
                name,
                password: null,
                is_verified: true,
            });

            await db.Candidate.create({
                candidate_id: user.id,
                resume_url: null,
                gender: null,
                address: null,
                dob: null,
            });
        }

        const access_token = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refresh_token = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await user.update({ refresh_token });

        return {
            err: 0,
            mes: 'Google login success',
            access_token: `Bearer ${access_token}`,
            refresh_token,
            user,
        };
    } catch (error) {
        console.error('Google callback service error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const logout = ({ user_id }) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({ where: { id: user_id } });

        if (!user) {
            return resolve({
                err: 1,
                mes: 'User not found',
            });
        }
        const updated = await db.User.update(
            { refresh_token: null, active_status: false },
            { where: { id: user_id } }
        );

        if (updated[0] === 0) {
            return resolve({
                err: 1,
                mes: 'User not found or already logged out',
            });
        }

        resolve({
            err: 0,
            mes: 'Logout successfully',
            access_token: null,
            refresh_token: null,
            data: null,
        });
    } catch (error) {
        reject(error);
    }
});

export const forgotPasswordCandidate = async ({ email }) => {
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
        if (!user.role || user.role.value !== 'Candidate') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as candidate',
            };
        }
        const token = jwt.sign(
            { email },
            process.env.RESET_PASSWORD_SECRET,
            { expiresIn: '1h' }
        );
        await sendResetPasswordEmail(email, token, 'Candidate');

        return {
            err: 0,
            mes: 'Password reset link sent to your email. Please check your inbox.',
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const resetPasswordCandidate = async ({ token }) => {
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
        if (!user.role || user.role.value !== 'Candidate') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as candidate',
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


export const createNewPasswordCandidate = async ({ email, password }) => {
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
        if (!user.role || user.role.value !== 'Candidate') {
            return {
                err: 1,
                mes: 'You do not have permission to access this as candidate',
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