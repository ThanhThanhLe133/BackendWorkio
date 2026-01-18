import express from 'express'
import * as controller from '../../controllers/Candidate/dashboard.js' // Trỏ đúng file controller vừa sửa
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()
router.use(verifyToken);

router.get('/', controller.getDashboardData); // Chỉ để dấu /

export default router;