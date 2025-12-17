import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';

const router = express.Router()
router.use(verifyTokenAdmin);
router.post('/create-candidate', controllers.createCandidate)
router.get('/candidates', controllers.getAlCandidatesAdmin)
router.get('/candidate', controllers.getCandidateAdmin)
router.put('/candidate', controllers.updateCandidateAdmin)
router.delete('/candidate', controllers.deleteCandidateAdmin)
export default router; 
