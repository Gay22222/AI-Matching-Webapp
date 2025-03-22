/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/

// src/routes/reports.routes.js

import express from "express";
import {
  createReportHandler,
  getAllReportsHandler,
} from "../controllers/reports.controller.js";

const router = express.Router();

// Gửi báo cáo
router.post("/", createReportHandler);

// Lấy tất cả báo cáo
router.get("/", getAllReportsHandler);

export default router;


/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/