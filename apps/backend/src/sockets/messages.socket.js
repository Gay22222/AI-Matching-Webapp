import prisma from "../prisma/client.js";

const setupMessageSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("📡 Client connected:", socket.id);

    // Lắng nghe sự kiện gửi tin nhắn từ client
    socket.on("sendMessage", async (data) => {
      const { sender_id, receiver_id, match_id, content } = data;

      console.log("📩 WebSocket - sendMessage:", data);

      // Validate đơn giản
      if (!sender_id || !receiver_id || !match_id || !content) {
        return socket.emit("errorMessage", { error: "Missing required fields" });
      }

      try {
        // Lưu tin nhắn vào DB qua Prisma
        const message = await prisma.message.create({
          data: {
            sender_id,
            receiver_id,
            match_id,
            content,
          },
        });

        // Gửi tin nhắn đến client gửi + tất cả các client liên quan
        io.emit("receiveMessage", message);
        console.log("✅ Message saved & broadcast:", message);
      } catch (error) {
        console.error("❌ WebSocket DB Error:", error);
        socket.emit("errorMessage", { error: "Failed to save message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

export default setupMessageSocket;