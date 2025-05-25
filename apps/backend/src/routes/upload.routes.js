import express from "express";
import upload from "../utils/upload.js";
import { uploadController } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/single", upload.single("image"), uploadController.uploadSingle);

router.post(
    "/multiple",
    upload.array("images", 6),
    uploadController.uploadMultiple
);

export default router;
