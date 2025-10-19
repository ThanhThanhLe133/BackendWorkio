import * as controllers from '../../controllers/index.js'
import express from 'express'

const router = express.Router()
router.post('/register', controllers.register)
router.post('/verified', controllers.verifiedCallBack)
router.post('/login', controllers.login)
router.post('/google/login', controllers.googleLogin)
router.post('/google/callback', controllers.googleCallback)
router.post('/refresh-token', controllers.refreshToken)
router.post('/logout', controllers.logout)

export default router; 