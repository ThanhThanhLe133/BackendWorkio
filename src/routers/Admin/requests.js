import * as controllers from "../../controllers/index.js";
import express from "express";
import { verifyTokenAdmin } from "../../middleWares/verify_token.js";

const router = express.Router();

router.use(verifyTokenAdmin);
router.get("/requests", controllers.getAllSupportRequestsAdmin);
router.patch("/requests", controllers.updateSupportRequestAdmin);
router.delete("/requests", controllers.deleteSupportRequestAdmin);

export default router;

