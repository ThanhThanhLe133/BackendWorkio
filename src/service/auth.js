import { where } from 'sequelize';
import db from '../models/index.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword(password)
            }
        })

        console.log(response[0].email);

        const access_token = response[1]
            ? jwt.sign({ id: response[0].id, email: response[0].email, role_code: response[0].role_code }, process.env.JWT_SECRET, { expiresIn: '30s' })
            : null
        const refresh_token = response[1]
            ? jwt.sign({ id: response[0].id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' })
            : null

        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'register sucessfully' : 'Email is used',
            'access_token': access_token ? `Bearer ${access_token}` : null,
            'refresh_token': refresh_token
        })
        if (refresh_token) {
            await db.User.update(
                {
                    refresh_token: refresh_token
                },
                {
                    where: { id: response[0].id }
                })
        }
    } catch (error) {
        reject(error)
    }
})


export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email },
            raw: true //tra ve object 
        })

        const isChecked = response && bcrypt.compareSync(password, response.password)
        const access_token = isChecked
            ? jwt.sign({ id: response.id, email: response.email, role_code: response.role_code }, process.env.JWT_SECRET, { expiresIn: '5s' })
            : null

        const refresh_token = isChecked
            ? jwt.sign({ id: response.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '30s' })
            : null
        resolve({
            err: access_token ? 0 : 1,
            mes: access_token ? 'Login sucessfully' : response ? 'password is wrong' : 'email has not been registered',
            'access_token': access_token ? `Bearer ${access_token}` : null,
            'refresh_token': refresh_token
        })
        if (refresh_token) {
            await db.User.update(
                {
                    refresh_token: refresh_token
                },
                {
                    where: { id: response.id }
                })
        }
    } catch (error) {
        reject(error)
    }
})

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {

        const response = await db.User.findOne({
            where: { refresh_token },
            raw: true
        })
        if (response) {
            jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
                if (err) {
                    resolve({
                        err: 1,
                        mes: 'Refresh token expired. Require login.'
                    })
                }
                else {
                    const access_token = jwt.sign({ id: response.id, email: response.email, role_code: response.role_code }, process.env.JWT_SECRET, { expiresIn: '1h' })

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