import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()
router.get('/verified', controllers.verifiedCallBackRecruiter)
router.post('/login', controllers.loginRecruiter)
router.post('/forgot-password', controllers.forgotPasswordRecruiter)
router.post('/refresh-token', controllers.refreshToken)
router.get('/reset-password', controllers.resetPasswordRecruiter)
router.use(verifyToken);
router.post('/create-new-password', controllers.createNewPasswordRecruiter)
router.post('/logout', controllers.logoutRecruiter)

export default router; 