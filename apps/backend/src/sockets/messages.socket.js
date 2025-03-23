/*----------------------------------------*/
/*Gay22222 begin-section*/
/*----------------------------------------*/

// messages.socket.js
import prisma from "../prisma/client.js";

/**
 * Thiết lập các sự kiện WebSocket liên quan đến tin nhắn.
 *
 * @function setupMessageSocket
 * @description Xử lý các sự kiện WebSocket liên quan đến việc gửi và nhận tin nhắn giữa hai người dùng.
 *
 * @param {Object} io - Đối tượng Socket.IO server.
 * @param {Object} socket - Đối tượng Socket.IO client kết nối.
 */
const setupMessageSocket = (io, socket) => {
  /**
   * Sự kiện gửi tin nhắn.
   *
   * @event sendMessage
   * @description Lắng nghe sự kiện "sendMessage" từ client, lưu tin nhắn vào cơ sở dữ liệu và phát lại tin nhắn cho tất cả các client.
   *
   * @param {Object} data - Dữ liệu tin nhắn từ client.
   * @param {number} data.sender_id - ID của người gửi tin nhắn.
   * @param {number} data.receiver_id - ID của người nhận tin nhắn.
   * @param {number} data.match_id - ID của cặp ghép đôi.
   * @param {string} data.content - Nội dung tin nhắn.
   *
   * @returns {void} - Phát sự kiện "receiveMessage" với tin nhắn đã lưu hoặc phát sự kiện "errorMessage" nếu có lỗi.
   */
  socket.on("sendMessage", async (data) => {
    const { sender_id, receiver_id, match_id, content } = data;

    // Kiểm tra dữ liệu đầu vào
    if (!sender_id || !receiver_id || !match_id || !content) {
      return socket.emit("errorMessage", { error: "Missing required fields" });
    }

    try {
      // Lưu tin nhắn vào cơ sở dữ liệu
      const message = await prisma.message.create({
        data: { sender_id, receiver_id, match_id, content },
      });

      // Phát tin nhắn cho tất cả các client
      io.emit("receiveMessage", message);
    } catch (error) {
      console.error("[Socket:Message] DB Error:", error);
      socket.emit("errorMessage", { error: "Failed to save message" });
    }
  });
};

export default setupMessageSocket;

/*----------------------------------------*/
/*Gay22222 end-section*/
/*----------------------------------------*/