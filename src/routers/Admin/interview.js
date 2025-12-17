import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenAdmin);
router.post('/interview', controllers.createInterviewAdmin)
router.patch('/interview', controllers.editInterviewAdmin)
router.delete('/interview', controllers.deleteInterviewAdmin)
router.get('/all-interviews', controllers.getAllInterviewsAdmin)
router.get('/interviews-of-candidate', controllers.getAllInterviewsByCandidate)
export default router;
