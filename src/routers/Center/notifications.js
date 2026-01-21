import * as controllers from '../../controllers/index.js';
import express from 'express';
import { verifyTokenCenter } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenCenter);
router.get('/notifications', controllers.getCenterNotifications);

export default router;
