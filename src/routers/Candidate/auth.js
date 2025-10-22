import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()
router.post('/register', controllers.registerCandidate)
router.get('/verified', controllers.verifiedCallBackCandidate)
router.post('/login', controllers.loginCandidate)
router.get('/google-login', controllers.googleLogin)
router.get('/google-callback', controllers.googleCallback)
router.post('/forgot-password', controllers.forgotPasswordCandidate)
router.get('/reset-password', controllers.resetPasswordCandidate)
router.post('/create-new-password', controllers.createNewPasswordCandidate)
router.use(verifyToken);
router.post('/refresh-token', controllers.refreshToken)
router.post('/logout', controllers.logout)

export default router; 