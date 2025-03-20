const setupMessageSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Nhận tin nhắn từ client
        socket.on("sendMessage", (data) => {
            console.log("New message received:", data);

            // Phát tin nhắn đến tất cả client khác
            io.emit("receiveMessage", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

export default setupMessageSocket;
