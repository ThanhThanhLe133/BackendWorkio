import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()
router.post('/register', controllers.registeRecruiter)
router.get('/verified', controllers.verifiedCallBackRecruiter)
router.post('/login', controllers.loginRecruiter)
router.use(verifyToken);
router.post('/refresh-token', controllers.refreshToken)
router.post('/logout', controllers.logout)

export default router; 