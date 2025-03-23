// notifications.socket.js
import prisma from "../prisma/client.js";

/**
 * Thiết lập các sự kiện WebSocket liên quan đến thông báo.
 *
 * @function setupNotificationSocket
 * @description Xử lý các sự kiện WebSocket liên quan đến việc gửi và nhận thông báo giữa các người dùng.
 *
 * @param {Object} io - Đối tượng Socket.IO server.
 * @param {Object} socket - Đối tượng Socket.IO client kết nối.
 */
const setupNotificationSocket = (io, socket) => {
  /**
   * Sự kiện tham gia phòng người dùng.
   *
   * @event joinUser
   * @description Lắng nghe sự kiện "joinUser" từ client và thêm người dùng vào phòng WebSocket tương ứng với ID của họ.
   *
   * @param {number} userId - ID của người dùng muốn tham gia phòng.
   *
   * @returns {void}
   */
  socket.on("joinUser", (userId) => {
    const room = `user:${userId}`;
    socket.join(room);
  });

  /**
   * Sự kiện gửi thông báo.
   *
   * @event sendNotification
   * @description Lắng nghe sự kiện "sendNotification" từ client, lưu thông báo vào cơ sở dữ liệu và phát lại thông báo cho người nhận.
   *
   * @param {Object} data - Dữ liệu thông báo từ client.
   * @param {number} data.recipient_id - ID của người nhận thông báo.
   * @param {number} [data.sender_id] - ID của người gửi thông báo (có thể null).
   * @param {string} data.type - Loại thông báo (ví dụ: "like", "match").
   * @param {string} data.content - Nội dung thông báo.
   *
   * @returns {void} - Phát sự kiện "receiveNotification" với thông báo đã lưu hoặc phát sự kiện "errorNotification" nếu có lỗi.
   */
  socket.on("sendNotification", async (data) => {
    const { recipient_id, sender_id, type, content } = data;

    // Kiểm tra dữ liệu đầu vào
    if (!recipient_id || !type || !content) {
      return socket.emit("errorNotification", { error: "Missing required fields" });
    }

    try {
      // Lưu thông báo vào cơ sở dữ liệu
      const notification = await prisma.notification.create({
        data: { recipient_id, sender_id, type, content },
      });

      // Phát thông báo cho người nhận
      io.to(`user:${recipient_id}`).emit("receiveNotification", notification);
    } catch (error) {
      console.error("[Socket:Notification] DB Error:", error);
      socket.emit("errorNotification", { error: "Failed to save notification" });
    }
  });
};

export default setupNotificationSocket;
