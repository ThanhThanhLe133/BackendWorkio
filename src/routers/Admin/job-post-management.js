import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenAdmin);
router.post('/job-post', controllers.createJobPostAdmin)
router.patch('/job-post', controllers.editJobPostAdmin)
router.patch('/apply-job-post', controllers.applyJobAdmin)
router.delete('/job-post', controllers.deleteJobPostAdmin)
router.get('/job-posts', controllers.getAllJobPostsAdmin)
router.get('/candidates-of-job-post', controllers.getAllCandidatesOfPostAdmin)
router.get('/job-posts-of-candidate', controllers.getAllPostsOfCandidateAdmin)
router.get('/filter-by-fields', controllers.filterJobsByFieldsAdmin)
router.get('/suggested-jobs', controllers.suggestJobsForCandidateAdmin)
router.get('/suggested-candidates', controllers.suggestJobsForCandidateAdmin)
export default router; 