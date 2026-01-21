import express from "express";
import * as controllers from "../../controllers/index.js";

const router = express.Router();

// Không cần token để lấy danh sách training fields (public endpoint)
router.get("/", controllers.getTrainingFields);

export default router;
