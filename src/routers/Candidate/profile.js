import express from 'express';
import { verifyToken } from '../../middleWares/verify_token.js';
import { isCandidate } from '../../middleWares/verify_roles.js'; // Import hàm mới
import * as controllers from '../../controllers/Candidate/profileController.js';

const router = express.Router();

/**
 * @route PATCH /
 * @description Edit candidate profile
 * @access Private (Candidate only)
 */
router.patch(
    '/',
    verifyToken,
    isCandidate, // Dùng middleware isCandidate
    controllers.editProfile
);

export default router;