import { matchRepository } from "../repository/match.repository.js";
import { messageService } from "../services/message.service.js";
import { findSocketId } from "../utils/socketHelpers.js";
import logger from "../utils/logger.js";

const setupMessageSocket = (io, socket, user, connectedUsers) => {
  socket.on("new-message", async (data) => {
    const senderId = user?.id;
    const { receiverId, matchId, text, sender_id } = data;

    // Sử dụng sender_id từ data nếu có, nếu không thì dùng user.id
    const effectiveSenderId = sender_id || senderId;

    // Kiểm tra các trường bắt buộc
    if (!effectiveSenderId || !receiverId || !matchId || !text) {
      logger.warn("Missing required fields for new-message event", { data });
      return socket.emit("errorMessage", {
        error: "Missing required fields",
      });
    }

    try {
      // Không tạo lại tin nhắn vì đã được tạo qua API POST /api/message
      logger.info(`Emitting new message for match ${matchId}`);

      // Lấy danh sách users từ connectedUsers (Map)
      const users = Array.from(connectedUsers.values());
      const receiverSocketId = findSocketId(users, receiverId);

      // Emit sự kiện với dữ liệu tin nhắn nguyên bản
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("receive-new-message", data);
      }
      socket.emit("receive-new-message", data); // Gửi lại cho sender
    } catch (error) {
      logger.error({ error, stack: error.stack }, `Error processing new-message for match ${matchId}`);
      socket.emit("errorMessage", { error: error.message });
    }
  });

  socket.on("request-chat", async (receiverId) => {
    const users = Array.from(connectedUsers.values());
    const senderId = user.id;
    const receiverSocketId = findSocketId(users, receiverId);
    if (!senderId || !receiverId) {
      logger.warn("Missing required fields for request-chat event");
      return socket.emit("errorMessage", {
        error: "Missing required fields",
      });
    }
    socket.to(receiverSocketId).emit("receive-request-chat", senderId);
    socket.emit("request-chat", "Waiting for response...");
  });

  socket.on("accept-chat", async (senderId) => {
    const users = Array.from(connectedUsers.values());
    const receiverId = user.id;
    if (!senderId || !receiverId) {
      logger.warn("Missing required fields for accept-chat event");
      return socket.emit("errorMessage", {
        error: "Missing required fields",
      });
    }
    const senderSocketId = findSocketId(users, senderId);

    try {
      const match = await matchRepository.create(senderId, receiverId);
      logger.info(`Match created for users ${senderId} and ${receiverId}`);
      socket.to(senderSocketId).emit("receive-accept-chat", { receiverId, match });
    } catch (error) {
      logger.error({ error, stack: error.stack }, `Error creating match for users ${senderId} and ${receiverId}`);
      socket.emit("errorMessage", { error: error.message });
    }
  });

  socket.on("decline-chat", async (senderId) => {
    const users = Array.from(connectedUsers.values());
    const receiverId = user.id;
    if (!senderId || !receiverId) {
      logger.warn("Missing required fields for decline-chat event");
      return socket.emit("errorMessage", {
        error: "Missing required fields",
      });
    }
    const senderSocketId = findSocketId(users, senderId);
    socket.to(senderSocketId).emit("decline-chat", receiverId);
  });
};

export default setupMessageSocket;