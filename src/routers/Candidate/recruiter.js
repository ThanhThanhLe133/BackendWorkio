import express from 'express';
import * as controllers from '../../controllers/index.js';
import { verifyTokenCandidate } from '../../middleWares/verify_token.js';

const router = express.Router();
router.use(verifyTokenCandidate);
router.get('/recruiter', controllers.getRecruiterDetailCandidate);

export default router;
