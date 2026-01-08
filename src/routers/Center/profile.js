import express from 'express';
import * as controllers from '../../controllers/index.js';
import { verifyTokenCenter } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenCenter);

router.get('/', controllers.getCenterProfile);
router.put('/update', controllers.updateCenterProfile);

export default router;
