import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateCredentialsMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", validateCredentialsMiddleware, login);
router.post("/register", validateCredentialsMiddleware, register);

export default router;
