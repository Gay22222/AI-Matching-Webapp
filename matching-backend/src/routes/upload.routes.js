import express from "express";
import upload from "../utils/upload.js";
import { uploadController } from "../controllers/upload.controller.js";
import { authenticationMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/single", authenticationMiddleware, upload.single("image"), uploadController.uploadSingle);
router.post("/multiple", authenticationMiddleware, upload.array("images", 6), uploadController.uploadMultiple);
router.delete("/:photoId", authenticationMiddleware, uploadController.deletePhoto); // Thêm route DELETE

export default router;