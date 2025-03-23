/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/


// src/controllers/reports.controller.js

import {
    createReportService,
    getAllReportsService,
  } from "../services/reports.service.js";
 

/**
 * Tạo báo cáo mới
 *
 * @function createReportHandler
 * @description Xử lý yêu cầu tạo báo cáo mới giữa hai người dùng.
 *
 * @param {Object} req - Đối tượng request từ client.
 * @param {Object} req.body - Dữ liệu gửi từ client.
 * @param {string} req.body.reason - Lý do báo cáo (ví dụ: "spam", "abuse").
 * @param {string} [req.body.details] - Chi tiết bổ sung cho báo cáo (có thể null nếu không cần thiết).
 * @param {number} req.body.reported_by - ID của người gửi báo cáo.
 * @param {number} req.body.reported_user - ID của người bị báo cáo.
 *
 * @param {Object} res - Đối tượng response để trả kết quả về client.
 *
 * @returns {Object} - Trả về JSON chứa thông tin báo cáo đã tạo hoặc lỗi.
 */  

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
  /**
 * Lấy danh sách tất cả các báo cáo
 *
 * @function getAllReportsHandler
 * @description Xử lý yêu cầu lấy danh sách tất cả các báo cáo trong hệ thống.
 *
 * @param {Object} req - Đối tượng request từ client.
 *
 * @param {Object} res - Đối tượng response để trả kết quả về client.
 *
 * @returns {Object} - Trả về JSON chứa danh sách các báo cáo hoặc lỗi.
 */
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