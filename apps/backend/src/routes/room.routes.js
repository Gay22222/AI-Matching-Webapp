import express from "express";
import { getRoom } from "../controllers/room.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";
import { roomMiddleware } from "../middleware/room.middleware.js";

const router = express.Router();

router.get("/:roomId", authenticationMiddleware, roomMiddleware, getRoom);

export default router;
