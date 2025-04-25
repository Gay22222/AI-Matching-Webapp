import express from "express";
import { getProfile, getUsersOnline } from "../controllers/user.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticationMiddleware, getProfile);
router.get("/users/online", authenticationMiddleware, getUsersOnline);

export default router;
