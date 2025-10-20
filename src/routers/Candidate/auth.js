import * as controllers from '../../controllers/index.js'
import express from 'express'
import verifyToken from "../../middleWares/verify_token.js";

const router = express.Router()
router.post('/register', controllers.register)
router.get('/verified', controllers.verifiedCallBack)
router.post('/login', controllers.login)
router.get('/google-login', controllers.googleLogin)
router.get('/google-callback', controllers.googleCallback)
router.post('/refresh-token', controllers.refreshToken)
router.use(verifyToken);
router.post('/logout', controllers.logout)

export default router; 