const reports = [];

// Gửi báo cáo
export const submitReport = (req, res) => {
    const { reporter, reason, details } = req.body;
    const report = { id: reports.length + 1, reporter, reason, details, timestamp: new Date() };
    reports.push(report);
    res.status(201).json({ message: "Report submitted", data: report });
};

// Lấy danh sách báo cáo
export const getReports = (req, res) => {
    res.json(reports);
};
