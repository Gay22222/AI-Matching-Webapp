/*----------------------------------------*/
/*Gay22222 begin-section*/
/*----------------------------------------*/

// messages.socket.js
import { matchRepository } from "../repository/match.repository.js";
import { messageService } from "../services/message.service.js";
import { findSocketId } from "../utils/socketHelpers.js";

/**
 * Thiết lập các sự kiện WebSocket liên quan đến tin nhắn.
 *
 * @function setupMessageSocket
 * @description Xử lý các sự kiện WebSocket liên quan đến việc gửi và nhận tin nhắn giữa hai người dùng.
 *
 * @param {Object} io - Đối tượng Socket.IO server.
 * @param {Object} socket - Đối tượng Socket.IO client kết nối.
 */
const setupMessageSocket = (io, socket, user, getUsers) => {
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

    socket.on("send-message", async (data) => {
        console.log("send-message");

        const users = getUsers();
        const sender_id = user?.id;
        const { receiver_id, match_id, content } = data;
        const receiverSocketId = findSocketId(users, receiver_id);
        const senderSocketId = findSocketId(users, sender_id);
        // Kiểm tra dữ liệu đầu vào
        if (!sender_id || !receiver_id || !match_id || !content) {
            return socket.emit("errorMessage", {
                error: "Missing required fields",
            });
        }
        try {
            // Lưu tin nhắn vào cơ sở dữ liệu
            const message = await messageService.sendMessageService({
                sender_id,
                receiver_id,
                match_id,
                content,
            });
            socket.to(receiverSocketId).emit("receive-message", message);
            socket.emit("receive-message", message);
        } catch (error) {
            console.error("[Socket:Message] DB Error:", error);
            socket.emit("errorMessage", { error: "Failed to save message" });
        }
    });

    socket.on("request-chat", async (receiverId) => {
        const users = getUsers();
        const sender_id = user.id;
        const receiverSocketId = findSocketId(users, receiverId);
        if (!sender_id || !receiverId) {
            return socket.emit("errorMessage", {
                error: "Missing required fields",
            });
        }
        socket.to(receiverSocketId).emit("receive-request-chat", sender_id);
        socket.emit("request-chat", "Waiting for response...".trim());
    });

    socket.on("accept-chat", async (senderId) => {
        const users = getUsers();
        const receiverId = user.id;
        if (!senderId || !receiverId) {
            return socket.emit("errorMessage", {
                error: "Missing required fields",
            });
        }
        const senderSocketId = findSocketId(users, senderId);

        // create a room
        const room = await matchRepository.createRoom({ senderId, receiverId });

        socket
            .to(senderSocketId)
            .emit("receive-accept-chat", { receiverId, room });
    });

    socket.on("decline-chat", async (data) => {
        const users = getUsers();
        const senderId = data;
        const receiverId = user.id;

        // Kiểm tra dữ liệu đầu vào
        if (!senderId || !receiverId) {
            return socket.emit("errorMessage", {
                error: "Missing required fields",
            });
        }
        const senderSocketId = findSocketId(users, senderId);
        socket.to(senderSocketId).emit("decline-chat", receiverId);
    });
};

export default setupMessageSocket;

/*----------------------------------------*/
/*Gay22222 end-section*/
/*----------------------------------------*/
