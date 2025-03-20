import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import setupMessageSocket from "./sockets/messages.socket.js";

const PORT = process.env.PORT || 5000;

// Tạo HTTP Server
const server = createServer(app);

// Khởi tạo WebSocket server
const io = new Server(server, {
    cors: {
        origin: "*", // Chỉnh origin theo domain nếu deploy
        methods: ["GET", "POST"]
    }
});

// Kết nối WebSocket cho hệ thống tin nhắn
setupMessageSocket(io);

// Chạy server
server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
