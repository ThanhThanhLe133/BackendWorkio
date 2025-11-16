import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyTokenAdmin } from '../../middleWares/verify_token.js';
const router = express.Router()
router.use(verifyTokenAdmin);
router.get('/social-insurances', controllers.getSocialInsurances)
router.get('/unemployed-benefits', controllers.countUnemploymentBenefits)
export default router; 