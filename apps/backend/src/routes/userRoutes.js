import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import upload from "../middleware/upload.js";
import { uploadPhoto } from "../controllers/userController.js";

const router = express.Router();

// GET user profile by ID
router.get("/profile/:userId", getUserProfile);
//POST upload photo
router.post('/bio/:bioId/upload', upload.single('image'), uploadPhoto);

export default router;
