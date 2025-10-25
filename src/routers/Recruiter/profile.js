import express from 'express';
import { verifyToken } from '../../middleWares/verify_token.js';
import { isRecruiter } from '../../middleWares/verify_roles.js';
import * as controllers from '../../controllers/Recruiter/profileController.js';

const router = express.Router();

/**
 * @route PATCH /
 * @description Edit recruiter profile
 * @access Private (Recruiter only)
 */
router.patch(
    '/',
    verifyToken,
    isRecruiter,   // Kiểm tra xem có phải Recruiter không
    controllers.editProfile
);

export default router;