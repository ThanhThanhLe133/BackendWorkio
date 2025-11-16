import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenAdmin);
router.get('/report', controllers.getReportByMonth)
router.get('/report-doc', controllers.generateMonthReport)
export default router; 