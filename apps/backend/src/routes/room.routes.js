import express from "express";
import { getRoom } from "../controllers/room.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roomMiddleware } from "../middleware/room.middleware.js";

const router = express.Router();

router.get("/:roomId", authMiddleware, roomMiddleware, getRoom);

export default router;
