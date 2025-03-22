/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/


// src/services/reports.service.js

import prisma from "../prisma/client.js";

// Tạo báo cáo mới
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

// Lấy danh sách tất cả báo cáo
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