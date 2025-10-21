import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from "../../middleWares/verify_token.js";

const router = express.Router()
router.use(verifyTokenAdmin);
router.get('/get-all-recruiters', controllers.getAllRecruitersAdmin)
router.post('/sendEmailToRecruiter', controllers.getAllRecruitersAdmin)

export default router; 