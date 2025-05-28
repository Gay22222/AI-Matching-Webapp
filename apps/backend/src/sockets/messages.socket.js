import { matchRepository } from "../repository/match.repository.js";
import { messageService } from "../services/message.service.js";
import { findSocketId } from "../utils/socketHelpers.js";

const setupMessageSocket = (io, socket, user, getUsers) => {
    socket.on("new-message", async (data) => {
        console.log("new-message", data);

        const users = getUsers();
        const senderId = user?.id;
        const { receiverId, matchId, content } = data;
        const receiverSocketId = findSocketId(users, receiverId);
        // Kiểm tra dữ liệu đầu vào
        if (!senderId || !receiverId || !matchId || !content) {
            console.log(
                "missing required fields",
                "new-message",
                senderId,
                receiverId,
                matchId,
                content
            );

            return socket.emit("errorMessage", {
                error: "Missing required fields",
            });
        }
        console.log(receiverSocketId);

        socket.to(receiverSocketId).emit("receive-new-message");
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
