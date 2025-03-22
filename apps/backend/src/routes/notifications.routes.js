import express from "express";
import {
  createNotificationHandler,
  getUserNotificationsHandler,
  markAsReadHandler,
} from "../controllers/notifications.controller.js";

const router = express.Router();

router.post("/", createNotificationHandler); // Tạo thông báo mới
router.get("/:userId", getUserNotificationsHandler); // Lấy thông báo theo user
router.patch("/:id/read", markAsReadHandler); // Đánh dấu đã đọc

export default router;
