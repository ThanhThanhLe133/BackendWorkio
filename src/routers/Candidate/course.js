import * as controllers from '../../controllers/index.js';
import express from 'express';
import { verifyTokenCandidate } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenCandidate);

router.get('/courses', controllers.getCandidateCourses);
router.post('/courses/register', controllers.registerCourseCandidate);

export default router;
