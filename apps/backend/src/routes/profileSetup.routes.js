import express from "express";
import {
    getProfileSetup,
    getProfileSetupByUserId,
} from "../controllers/profileSetup.controller.js";

const router = express.Router();

router.get("/:userId", getProfileSetupByUserId);
router.get("/", getProfileSetup);

export default router;
