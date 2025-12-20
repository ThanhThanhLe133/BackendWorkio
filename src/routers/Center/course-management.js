import * as controllers from '../../controllers/index.js';
import express from 'express';
import { verifyTokenCenter } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenCenter);
router.post('/courses', controllers.createCourse);
router.get('/courses', controllers.getCenterCourses);
router.patch('/courses/:courseId', controllers.updateCourse);
router.delete('/courses/:courseId', controllers.deleteCourse);
router.post('/courses/:courseId/students', controllers.addStudentToCourse);
router.patch('/courses/:courseId/students/:candidateId', controllers.updateStudentStatus);
router.delete('/courses/:courseId/students/:candidateId', controllers.removeStudentFromCourse);

export default router;
