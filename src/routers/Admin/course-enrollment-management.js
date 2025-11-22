import * as controllers from '../../controllers/index.js';
import express from 'express';
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenAdmin);

router.post('/', controllers.createCourseEnrollment);
router.get('/', controllers.getAllCourseEnrollments);
router.get('/:id', controllers.getCourseEnrollmentById);
router.put('/:id', controllers.updateCourseEnrollment);
router.delete('/:id', controllers.deleteCourseEnrollment);

export default router;
