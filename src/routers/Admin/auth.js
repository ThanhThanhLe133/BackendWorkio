import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()
router.post('/login', controllers.loginAdmin)
router.post('/forgot-password', controllers.forgotPasswordAdmin)
router.get('/reset-password', controllers.resetPasswordAdmin)
router.post('/create-new-password', controllers.createNewPasswordAdmin)
router.use(verifyToken);
router.post('/refresh-token', controllers.refreshToken)
router.post('/logout', controllers.logoutAdmin)

export default router; 