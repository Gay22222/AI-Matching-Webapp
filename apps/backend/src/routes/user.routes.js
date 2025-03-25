import express from "express";
import { getProfile, getUsersOnline } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.get("/users/online", authMiddleware, getUsersOnline);

export default router;
