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
        origin: "*",
        methods: ["GET", "POST"],
    },
});
setIO(io);

let users = [];

const handleUserConnection = (socket, data, users) => {
    const isExistUserById = users.find((u) => u.id === data?.id);
    const isExistUserBySocketId = users.find((u) => u.socket_id === socket.id);
    const user = {
        socket_id: socket.id,
        id: data?.id,
        name: data?.name,
    };
    if (isExistUserById) {
        return user;
    }
    if (isExistUserBySocketId) {
        Object.assign(isExistUserBySocketId, {
            id: data?.id,
            name: data?.name,
        });
        return user;
    }
    users.push(user);
    return user;
};

// WebSocket
io.on("connection", (socket) => {
    socket.on("me", (data) => {
        socket.removeAllListeners("send-message");

        const user = handleUserConnection(socket, data, users);
        setupMessageSocket(io, socket, user, () => users);
        setupNotificationSocket(io, socket, user, () => users);
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user.socket_id !== socket.id);
    });
    socket.on("logout", () => {
        users = users.filter((user) => user.socket_id !== socket.id);
    });
});

// Chạy server
server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
