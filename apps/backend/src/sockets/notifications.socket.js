import prisma from "../prisma/client.js";
import { userService } from "../services/user.service.js";
import { findSocketId } from "../utils/socketHelpers.js";

const setupNotificationSocket = (io, socket, user, getUsers) => {
    socket.on("joinUser", (userId) => {
        const room = `user:${userId}`;
        socket.join(room);
    });

    socket.on("new-notification", async (receiverId) => {
        const users = getUsers();
        const receiverSocketId = findSocketId(users, receiverId);

        if (!receiverSocketId) {
            console.log("[Socket:Notification] User not connected");
        }
        socket.to(receiverSocketId).emit("new-notification");
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
