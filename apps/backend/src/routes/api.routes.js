import { Router } from "express";

const router = Router();
router.get("/hello", (req, res) => {
    res.json({ message: "Hello from Express Backend!" });
});

import messageRoutes from "./messages.routes.js";
import notificationRoutes from "./notifications.routes.js";
import reportRoutes from "./reports.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import roomRoutes from "./room.routes.js";
import profileSetupRoutes from "./profileSetup.routes.js";

router.use("/messages", messageRoutes);
router.use("/profile-setup", profileSetupRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/auth", authRoutes);
router.use("/rooms", roomRoutes);
router.use("/", userRoutes);

export default router;
