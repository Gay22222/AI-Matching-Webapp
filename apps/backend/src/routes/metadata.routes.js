import express from "express";
import { getMetadata } from "../controllers/metadata.controller.js";

const router = express.Router();

router.get("/", getMetadata);

export default router;
