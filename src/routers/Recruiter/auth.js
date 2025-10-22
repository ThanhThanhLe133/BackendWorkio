import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()
router.post('/register', controllers.registerRecruiter)
router.get('/verified', controllers.verifiedCallBackRecruiter)
router.post('/login', controllers.loginRecruiter)
router.post('/forgot-password', controllers.forgotPasswordRecruiter)
router.get('/reset-password', controllers.resetPasswordRecruiter)
router.post('/create-new-password', controllers.createNewPasswordRecruiter)
router.use(verifyToken);
router.post('/refresh-token', controllers.refreshToken)
router.post('/logout', controllers.logout)

export default router; 