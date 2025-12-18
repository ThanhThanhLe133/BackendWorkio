import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';

const router = express.Router()
router.use(verifyTokenAdmin);
router.get('/center', controllers.getCenterAdmin)
router.get('/centers', controllers.getAllCentersAdmin)
router.post('/center', controllers.createCenterAdmin)
router.get('/center/courses', controllers.getCenterCoursesAdmin)

export default router;
