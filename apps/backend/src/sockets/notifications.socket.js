// notifications.socket.js
import prisma from "../prisma/client.js";

const setupNotificationSocket = (io, socket) => {
  socket.on("joinUser", (userId) => {
    const room = `user:${userId}`;
    socket.join(room);
  });

  socket.on("sendNotification", async (data) => {
    const { recipient_id, sender_id, type, content } = data;

    if (!recipient_id || !type || !content) {
      return socket.emit("errorNotification", { error: "Missing required fields" });
    }

    try {
      const notification = await prisma.notification.create({
        data: { recipient_id, sender_id, type, content },
      });

      io.to(`user:${recipient_id}`).emit("receiveNotification", notification);
    } catch (error) {
      console.error("[Socket:Notification] DB Error:", error);
      socket.emit("errorNotification", { error: "Failed to save notification" });
    }
  });
};

export default setupNotificationSocket;
