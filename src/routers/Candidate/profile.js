import * as controllers from '../../controllers/index.js'
import express from 'express'
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router()

router.use(verifyToken);
router.put('/', controllers.updateCandidateProfile)

export default router;
