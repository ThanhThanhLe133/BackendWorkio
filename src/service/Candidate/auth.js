import db from '../../models/index.js'
import supabase from "../../config/supabaseClient.js";
import jwt from 'jsonwebtoken'

export const register = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${process.env.SERVER_URL}/auth/verified?email=${email}`
                }
            });

            if (error) {
                return resolve({
                    err: 1,
                    mes: error.message,
                    access_token: null,
                    refresh_token: null,
                });
            }
            const { user } = data;

            resolve({
                err: 0,
                mes: 'Register successfully. Please verify your email to continue.',
                access_token: null,
                refresh_token: null,
                data: user || null,
            });
        } catch (error) {
            reject(error);
        }
    });

export const verifiedCallBack = async (email) => {
    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();

        if (error) {
            return { err: 1, mes: error.message };
        }

        const user = users.find((u) => u.email === email);

        if (!user) {
            return { err: 1, mes: 'User not found' };
        }

        if (!user.email_confirmed_at) {
            return { err: 1, mes: 'Email not verified yet' };
        }

        const access_token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const refresh_token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: '7d' }
        );
        const role = await db.Role.findOne({ where: { value: 'candidate' } });
        const [record, created] = await db.User.findOrCreate({
            where: { email: user.email },
            defaults: {
                email: user.email,
                supabase_id: user.id,
                role_id: role.id,
                refresh_token,
            },
        });
        if (!created) {
            await db.User.update(
                { refresh_token },
                { where: { email: user.email } }
            );
        }

        return {
            err: 0,
            mes: 'Email verified successfully',
            access_token: `Bearer ${access_token}`,
            refresh_token,
            data: {
                id: user.id,
                email: user.email,
            },
        };
    } catch (error) {
        console.error('verifiedCallBack error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const login = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return resolve({
                    err: 1,
                    mes: error.message,
                    access_token: null,
                    refresh_token: null,
                });
            }
            const { user } = data;
            if (!user) {
                return resolve({
                    err: 1,
                    mes: 'Invalid credentials',
                });
            }
            const access_token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            const refresh_token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET_REFRESH,
                { expiresIn: '7d' }
            );
            const role = await db.Role.findOne({ where: { value: 'Candidate' } });
            const [dbUser, created] = await db.User.findOrCreate({
                where: { email: user.email },
                defaults: {
                    id: user.id,
                    email: user.email,
                    supabase_id: user.id,
                    role_id: role.id,
                    refresh_token,
                },
            });

            if (!created) {
                await db.User.update({ refresh_token }, { where: { email: user.email } });
            }

            await db.Candidate.findOrCreate({
                where: { candidate_id: dbUser.id },
                defaults: {
                    candidate_id: dbUser.id,
                    resume_url: null,
                    experience_years: 0,
                    skills: [],
                    gender: null,
                    address: null,
                    dob: null,
                },
            });

            const candidateWithUser = await db.Candidate.findOne({
                where: { candidate_id: dbUser.id },
                include: [{ model: db.User, as: 'user' }],
            });
            resolve({
                err: 0,
                mes: 'Login successfully',
                access_token: `Bearer ${access_token}`,
                refresh_token,
                data: candidateWithUser,
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
                        role_code: response.role_code
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

export const googleLogin = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.SERVER_URL}/auth/google/callback`
            }
        });

        if (error) {
            return { err: 1, mes: error.message };
        }

        return {
            err: 0,
            mes: 'Redirect to Google OAuth',
            data: data.url
        };
    } catch (error) {
        console.error('Google login error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};

export const googleCallBack = async (code) => {
    try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            return { err: 1, mes: error.message };
        }

        const { user } = data;

        const access_token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const refresh_token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: '7d' }
        );

        const role = await db.Role.findOne({ where: { value: 'candidate' } });
        const [record, created] = await db.User.findOrCreate({
            where: { email: user.email },
            defaults: {
                email: user.email,
                supabase_id: user.id,
                role_id: role.id,
                refresh_token,
            },
        });
        if (!created) {
            await db.User.update(
                { refresh_token },
                { where: { email: user.email } }
            );
        }
        return {
            err: 0,
            mes: 'Google login successful',
            access_token,
            refresh_token,
            data: {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || null,
            },
        };
    } catch (error) {
        console.error('Google callback service error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};


export const logout = async (refresh_token) => {
    try {
        if (!refresh_token) {
            return { err: 1, mes: 'Missing refresh token' };
        }

        const user = await db.User.findOne({ where: { refresh_token } });

        if (!user) {
            return { err: 1, mes: 'Invalid token or already logged out' };
        }

        await db.User.update(
            { refresh_token: null },
            { where: { email: user.email } }
        );

        return {
            err: 0,
            mes: 'Logout successfully',
        };
    } catch (error) {
        console.error('Logout error:', error);
        return { err: 1, mes: 'Internal Server Error' };
    }
};