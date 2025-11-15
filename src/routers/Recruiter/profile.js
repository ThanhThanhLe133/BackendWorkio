import express from 'express';
import * as controllers from '../../controllers/index.js';
import { verifyTokenRecruiter } from '../../middleWares/verify_token.js';

const router = express.Router();

router.use(verifyTokenRecruiter);

router.put('/update', controllers.updateRecruiterProfile);

export default router;
