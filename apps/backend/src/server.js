import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import setupMessageSocket from "./sockets/messages.socket.js";
import setupNotificationSocket from "./sockets/notifications.socket.js";
import { setIO } from "./utils/socket.js";
import cors from "cors";

const PORT = process.env.PORT || 3001;
app.use(cors({ origin: "http://localhost:3000" }));

// Tạo HTTP Server
const server = createServer(app);

// Khởi tạo WebSocket server
const io = new Server(server, {
    cors: {
        origin: "*", // Chỉnh origin theo domain nếu deploy
        methods: ["GET", "POST"],
    },
});
setIO(io);
// WebSocket
io.on("connection", (socket) => {
    console.log(" Client connected:", socket.id);

    setupMessageSocket(io, socket);
    setupNotificationSocket(io, socket);
});

// Chạy server
server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
