import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenCandidate } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenCandidate);
router.post('/apply-job-post', controllers.applyJobCandidate)
router.get('/job-posts', controllers.getAllJobPostsCandidate)
router.get('/job-posts-of-candidate', controllers.getAllPostsOfCandidateCandidate)
export default router; 