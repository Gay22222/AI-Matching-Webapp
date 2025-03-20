import { Router } from "express";
import { submitReport, getReports } from "../controllers/reports.controller.js";

const router = Router();

router.post("/", submitReport);
router.get("/", getReports);

export default router;
