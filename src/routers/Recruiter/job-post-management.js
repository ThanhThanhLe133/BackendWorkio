import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenRecruiter } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenRecruiter);
router.post('/job-post', controllers.createJobPostRecruiter)
router.patch('/job-post', controllers.editJobPostRecruiter)
router.delete('/job-post', controllers.deleteJobPostRecruiter)
router.get('/job-posts', controllers.getAllJobPostsRecruiter)
router.get('/candidates-of-job-post', controllers.getAllCandidatesOfPostRecruiter)
router.get('/suggested-candidates', controllers.suggestCandidatesForJobRecruiter)
export default router; 