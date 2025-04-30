import { Router } from "express";

const router = Router();

router.get("/hello", (req, res) => {
    res.json({ message: "Hello from Express Backend!" });
});

import messageRoutes from "./message.routes.js";
import notificationRoutes from "./notifications.routes.js";
import reportRoutes from "./reports.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import matchRoutes from "./match.routes.js";
import metadataRoutes from "./metadata.routes.js";

router.use("/messages", messageRoutes);
router.use("/metadata", metadataRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/auth", authRoutes);
router.use("/matches", matchRoutes);
router.use("/", userRoutes);

export default router;
