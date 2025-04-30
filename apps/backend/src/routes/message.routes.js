import { Router } from "express";
import { messageController } from "../controllers/message.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:matchId", authenticationMiddleware, messageController.getAll);
router.post("/", authenticationMiddleware, messageController.create);

export default router;
