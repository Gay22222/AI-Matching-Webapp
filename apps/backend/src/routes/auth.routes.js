import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import {
    validateLogin,
    validateRegistration,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/register", validateRegistration, register);

export default router;
