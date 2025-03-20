import { Router } from "express";
import { sendNotification, getNotifications } from "../controllers/notifications.controller.js";

const router = Router();

router.post("/", sendNotification);
router.get("/", getNotifications);

export default router;
