import prisma from "../prisma/client.js";
import { userService } from "../services/user.service.js";
import { findSocketId } from "../utils/socketHelpers.js";

const setupNotificationSocket = (io, socket, user, getUsers) => {
    socket.on("joinUser", (userId) => {
        const room = `user:${userId}`;
        socket.join(room);
    });

    socket.on("sendNotification", async (data) => {
        const { recipient_id, sender_id, type, content } = data;

        // Kiểm tra dữ liệu đầu vào
        if (!recipient_id || !type || !content) {
            return socket.emit("errorNotification", {
                error: "Missing required fields",
            });
        }

        try {
            // Lưu thông báo vào cơ sở dữ liệu
            const notification = await prisma.notification.create({
                data: { recipient_id, sender_id, type, content },
            });

            // Phát thông báo cho người nhận
            io.to(`user:${recipient_id}`).emit(
                "receiveNotification",
                notification
            );
        } catch (error) {
            console.error("[Socket:Notification] DB Error:", error);
            socket.emit("errorNotification", {
                error: "Failed to save notification",
            });
        }
    });

    socket.on("accept-match", async (match) => {
        const users = getUsers();

        const receiverId = user?.id;
        const senderId =
            match?.user_1_id === receiverId
                ? match?.user_2_id
                : match?.user_1_id;

        const receiverSocketId = findSocketId(users, receiverId);
        const senderSocketId = findSocketId(users, senderId);

        let sender;
        let receiver;

        if (receiverId) receiver = await userService.getProfileById(receiverId);

        if (senderId) sender = await userService.getProfileById(senderId);

        const senderProfile = {
            id: sender?.id,
            name: sender?.displayName,
            photos: sender?.photos,
        };
        const receiverProfile = {
            id: receiver?.id,
            name: receiver?.displayName,
            photos: receiver?.photos,
        };

        socket.to(receiverSocketId).emit("new-match", senderProfile);
        socket.to(senderSocketId).emit("new-match", receiverProfile);
    });
};

export default setupNotificationSocket;
