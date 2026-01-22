import * as controllers from '../../controllers/index.js';
import express from 'express';
import { verifyToken } from '../../middleWares/verify_token.js'; // Dùng verifyToken thường cho Candidate

const router = express.Router();

router.use(verifyToken);
router.get('/notifications', controllers.getCandidateNotifications);

export default router;