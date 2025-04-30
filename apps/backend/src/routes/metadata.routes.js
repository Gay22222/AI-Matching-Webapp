import express from "express";
import { metadataController } from "../controllers/metadata.controller.js";

const router = express.Router();

router.get("/", metadataController.get);

export default router;
