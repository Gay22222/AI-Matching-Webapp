import express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
import { reportController } from "../controllers/reports.controller.js";

const router = express.Router();

// router.post("/", authenticationMiddleware, reportController.create);
// router.get("/", authenticationMiddleware, reportController.getAll);

export default router;
