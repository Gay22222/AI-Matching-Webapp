import {
    createNotificationService,
    getUserNotificationsService,
    markNotificationAsReadService,
  } from "../services/notifications.service.js";
  
  import { getIO } from "../utils/socket.js"; //  Thêm để emit socket
  
/**
 * Tạo thông báo mới
 *
 * @function createNotificationHandler
 * @description Xử lý yêu cầu tạo thông báo mới và phát sự kiện realtime qua WebSocket.
 *
 * @param {Object} req - Đối tượng request từ client.
 * @param {Object} req.body - Dữ liệu gửi từ client.
 * @param {number} req.body.recipient_id - ID của người nhận thông báo.
 * @param {number} [req.body.sender_id] - ID của người gửi thông báo (có thể null).
 * @param {string} req.body.type - Loại thông báo (ví dụ: "like", "match").
 * @param {string} req.body.content - Nội dung thông báo.
 *
 * @param {Object} res - Đối tượng response để trả kết quả về client.
 *
 * @returns {Object} - Trả về JSON chứa thông tin thông báo đã tạo hoặc lỗi.
 */

  export const createNotificationHandler = async (req, res) => {
    const { recipient_id, sender_id, type, content } = req.body;
  
    if (!recipient_id || !type || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const notification = await createNotificationService({
        recipient_id,
        sender_id,
        type,
        content,
      });
  
      //  Emit socket realtime
      const io = getIO();
      io.to(`user:${recipient_id}`).emit("receiveNotification", notification);
  
      res.status(201).json({ message: "Notification created", data: notification });
    } catch (err) {
      console.error("Create Notification Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  /**
 * Lấy danh sách thông báo của người dùng
 *
 * @function getUserNotificationsHandler
 * @description Xử lý yêu cầu lấy danh sách thông báo của một người dùng.
 *
 * @param {Object} req - Đối tượng request từ client.
 * @param {Object} req.params - Các tham số từ URL.
 * @param {number} req.params.userId - ID của người dùng cần lấy thông báo.
 *
 * @param {Object} res - Đối tượng response để trả kết quả về client.
 *
 * @returns {Object} - Trả về JSON chứa danh sách thông báo hoặc lỗi.
 */
  export const getUserNotificationsHandler = async (req, res) => {
    const userId = Number(req.params.userId);
    try {
      const notifications = await getUserNotificationsService(userId);
      res.status(200).json(notifications);
    } catch (err) {
      console.error("Get Notifications Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  /**
 * Đánh dấu thông báo là đã đọc
 *
 * @function markAsReadHandler
 * @description Xử lý yêu cầu đánh dấu một thông báo là đã đọc.
 *
 * @param {Object} req - Đối tượng request từ client.
 * @param {Object} req.params - Các tham số từ URL.
 * @param {number} req.params.id - ID của thông báo cần đánh dấu là đã đọc.
 *
 * @param {Object} res - Đối tượng response để trả kết quả về client.
 *
 * @returns {Object} - Trả về JSON chứa thông tin thông báo đã cập nhật hoặc lỗi.
 */
  export const markAsReadHandler = async (req, res) => {
    const id = Number(req.params.id);
    try {
      const notification = await markNotificationAsReadService(id);
      res.status(200).json(notification);
    } catch (err) {
      console.error("Mark as read error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  