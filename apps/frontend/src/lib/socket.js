/**
 * Quản lý instance của Socket.IO client trong toàn bộ ứng dụng frontend.
 *
 * @description
 * - File này cung cấp một hàm để khởi tạo và truy cập instance của Socket.IO client.
 * - Đảm bảo rằng chỉ có một instance của Socket.IO client được sử dụng trong toàn bộ ứng dụng.
 *
 * @functions
 * - `getSocket`: Lấy hoặc khởi tạo instance của Socket.IO client.
 */

import { io } from "socket.io-client";

let socket;

/**
 * Lấy hoặc khởi tạo instance của Socket.IO client.
 *
 * @function getSocket
 * @description Truy cập instance hiện tại của Socket.IO client. Nếu chưa được khởi tạo, tạo một instance mới.
 *
 * @returns {Object} - Instance của Socket.IO client.
 */
export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000"); // Địa chỉ server WebSocket
  }
  return socket;
};
