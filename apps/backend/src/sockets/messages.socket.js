/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/

// messages.socket.js
import prisma from "../prisma/client.js";

const setupMessageSocket = (io, socket) => {
  socket.on("sendMessage", async (data) => {
    const { sender_id, receiver_id, match_id, content } = data;

    if (!sender_id || !receiver_id || !match_id || !content) {
      return socket.emit("errorMessage", { error: "Missing required fields" });
    }

    try {
      const message = await prisma.message.create({
        data: { sender_id, receiver_id, match_id, content },
      });

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