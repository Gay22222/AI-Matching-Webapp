import dotenv from 'dotenv';
import path from 'path';
import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import setupMessageSocket from './sockets/messages.socket.js';
import setupNotificationSocket from './sockets/notifications.socket.js';
import { setIO } from './utils/socket.js';
import { connectPrisma } from './prisma/client.js';
import logger from './utils/logger.js';
import { startRecommendationCron } from './utils/scheduler.js';

// Load .env từ thư mục gốc
dotenv.config({ path: path.resolve('.env') });

const PORT = process.env.PORT || 3001;
await connectPrisma();

const server = createServer(app);

// Khởi tạo WebSocket server
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
const pubClient = new Redis({ host: process.env.REDIS_HOST || 'localhost', port: process.env.REDIS_PORT || 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));
setIO(io);

// Lưu danh sách users đang kết nối
const connectedUsers = new Map();

function getUsers() {
    return Array.from(connectedUsers.values());
}

// WebSocket
io.on('connection', (socket) => {
    socket.on('me', (data) => {
        socket.removeAllListeners('send-message');
        const user = {
            socket_id: socket.id,
            id: data?.id,
            name: data?.name
        };
        connectedUsers.set(socket.id, user); // Lưu user vào Map
        logger.info({ user }, 'User connected');
        setupMessageSocket(io, socket, user, connectedUsers); // Truyền connectedUsers
        setupNotificationSocket(io, socket, user, getUsers); // Truyền getUsers
    });

    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id); // Xóa user khi ngắt kết nối
        logger.info(`Socket ${socket.id} disconnected`);
    });
    socket.on('logout', () => {
        connectedUsers.delete(socket.id); // Xóa user khi logout
        logger.info(`Socket ${socket.id} logged out`);
    });
});

startRecommendationCron();

// Chạy server
server.listen(PORT, () => {
    logger.info(`Backend running on http://localhost:${PORT}`);
});