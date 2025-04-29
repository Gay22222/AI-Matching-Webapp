import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateCredentialsMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", validateCredentialsMiddleware, authController.login);
router.post(
    "/register",
    validateCredentialsMiddleware,
    authController.register
);
router.post("/send-verification-otp", authController.requestVerificationCode);
router.post("/verify-otp", authController.verifyEmailWithOtp);

export default router;
