import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenAdmin);
router.post('/create-recruiter', controllers.createRecruiter)
router.get('/recruiters', controllers.getAllRecruitersAdmin)
export default router; 