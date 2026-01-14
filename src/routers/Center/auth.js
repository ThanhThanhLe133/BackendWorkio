import * as controllers from "../../controllers/index.js";
import express from "express";
import { verifyToken } from "../../middleWares/verify_token.js";

const router = express.Router();

router.post("/login", controllers.loginCenter);
router.post("/forgot-password", controllers.forgotPasswordCenter);
router.post("/reset-password", controllers.resetPasswordCenter);
router.post("/create-new-password", controllers.createNewPasswordCenter);
router.post("/logout", verifyToken, controllers.logoutCenter);

export default router;

