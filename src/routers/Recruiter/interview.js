import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenRecruiter } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenRecruiter);
router.post('/interview', controllers.createInterviewRecruiter)
router.patch('/interview', controllers.editInterviewRecruiter)
router.delete('/interview', controllers.deleteInterviewRecruiter)
router.get('/interviews-of-recruiter', controllers.getAllInterviewsRecruiter)
export default router; 