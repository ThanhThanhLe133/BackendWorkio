import db from '../../models/index.js'
import bcrypt from "bcryptjs"
import { google } from 'googleapis';
import jwt from 'jsonwebtoken'
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
export const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/candidate/auth/verified?token=${token}`;

    const mailOptions = {
        from: `"Workio Confirmation" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Confirm your signup to continue',
        html: `
            <h2>Confirm your signup in Workio</h2>
            <p>Click the link below to verify your email (valid for 1 day):</p>
            <a href="${verifyUrl}">Verify your account</a>
        `,
    };

    await transporter.sendMail(mailOptions);
};
export const register = ({ email, password }) =>
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

            await sendVerificationEmail(email, token);

            await db.Candidate.create({
                candidate_id: user.id,
                resume_url: null,
                experience_years: 0,
                skills: [],
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
export const verifiedCallBack = async (token) => {
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

export const login = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
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

            if (!user.candidate.is_verified) {
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
                experience_years: 0,
                skills: [],
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