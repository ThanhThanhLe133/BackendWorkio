import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()
router.get('/verified', controllers.verifiedCallBackCandidate)
router.post('/login', controllers.loginCandidate)
router.post('/forgot-password', controllers.forgotPasswordCandidate)
router.post('/refresh-token', controllers.refreshToken)
router.use(verifyToken);
router.get('/reset-password', controllers.resetPasswordCandidate)
router.post('/create-new-password', controllers.createNewPasswordCandidate)
router.post('/logout', controllers.logoutCandidate)

export default router; 