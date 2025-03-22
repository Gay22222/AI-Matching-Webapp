/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/


// src/controllers/reports.controller.js

import {
    createReportService,
    getAllReportsService,
  } from "../services/reports.service.js";
  
  // POST /api/reports
  export const createReportHandler = async (req, res) => {
    const { reason, details, reported_by, reported_user } = req.body;
  
    if (!reason || !reported_by || !reported_user) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const report = await createReportService({
        reason,
        details,
        reported_by,
        reported_user,
      });
  
      res.status(201).json({
        message: "Report submitted",
        data: report,
      });
    } catch (error) {
      console.error(" Failed to submit report:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // GET /api/reports
  export const getAllReportsHandler = async (req, res) => {
    try {
      const reports = await getAllReportsService();
      res.status(200).json(reports);
    } catch (error) {
      console.error(" Failed to fetch reports:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  


/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/