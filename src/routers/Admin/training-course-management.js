import * as controllers from '../../controllers/index.js';
import express from 'express';
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenAdmin);

router.post('/', controllers.createTrainingCourse);
router.get('/', controllers.getAllTrainingCourses);
router.get('/:id', controllers.getTrainingCourseById);
router.put('/:id', controllers.updateTrainingCourse);
router.delete('/:id', controllers.deleteTrainingCourse);

export default router;
