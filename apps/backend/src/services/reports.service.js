/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/


// src/services/reports.service.js

import prisma from "../prisma/client.js";


/**
 * Tạo báo cáo mới.
 *
 * @function createReportService
 * @description Tạo một báo cáo mới giữa hai người dùng và lưu vào cơ sở dữ liệu.
 *
 * @param {Object} data - Dữ liệu báo cáo.
 * @param {string} data.reason - Lý do báo cáo (ví dụ: "spam", "abuse").
 * @param {string} [data.details] - Chi tiết bổ sung cho báo cáo (có thể null nếu không cần thiết).
 * @param {number} data.reported_by - ID của người gửi báo cáo.
 * @param {number} data.reported_user - ID của người bị báo cáo.
 *
 * @returns {Object} - Trả về đối tượng báo cáo đã được tạo.
 */
export const createReportService = async ({
  reason,
  details,
  reported_by,
  reported_user,
}) => {
  return prisma.report.create({
    data: {
      reason,
      details,
      reported_by,
      reported_user,
    },
  });
};


/**
 * Lấy danh sách tất cả báo cáo.
 *
 * @function getAllReportsService
 * @description Truy vấn danh sách tất cả các báo cáo từ cơ sở dữ liệu.
 *
 * @returns {Array<Object>} - Trả về danh sách các báo cáo, được sắp xếp theo thứ tự thời gian giảm dần.
 * Mỗi báo cáo bao gồm thông tin của người gửi báo cáo và người bị báo cáo.
 */
export const getAllReportsService = async () => {
  return prisma.report.findMany({
    orderBy: { time_report: "desc" },
    include: {
      reporter: {
        select: { id: true, display_name: true, email: true },
      },
      reportedUser: {
        select: { id: true, display_name: true, email: true },
      },
    },
  });
};


/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/