import * as controllers from "../../controllers/index.js";
import express from "express";

const router = express.Router();

router.post("/login", controllers.loginCenter);

export default router;

