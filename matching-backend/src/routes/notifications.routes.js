import express from "express";
import { notificationController } from "../controllers/notification.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticationMiddleware, notificationController.create);
router.get("/", authenticationMiddleware, notificationController.getAll);

export default router;
