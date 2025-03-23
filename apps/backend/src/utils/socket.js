/**
 * Quản lý instance của Socket.IO trong toàn bộ ứng dụng.
 *
 * @description
 * - File này cung cấp các hàm để thiết lập và truy cập instance của Socket.IO.
 * - Đảm bảo rằng chỉ có một instance của Socket.IO được sử dụng trong toàn bộ ứng dụng.
 *
 * @functions
 * - `setIO`: Thiết lập instance của Socket.IO.
 * - `getIO`: Lấy instance hiện tại của Socket.IO.
 */

let ioInstance = null;

/**
 * Thiết lập instance của Socket.IO.
 *
 * @function setIO
 * @description Lưu trữ instance của Socket.IO để sử dụng trong toàn bộ ứng dụng.
 *
 * @param {Object} io - Đối tượng Socket.IO server.
 *
 * @returns {void}
 */
export const setIO = (io) => {
  ioInstance = io;
};

/**
 * Lấy instance hiện tại của Socket.IO.
 *
 * @function getIO
 * @description Truy cập instance của Socket.IO đã được thiết lập. Nếu chưa được thiết lập, ném ra lỗi.
 *
 * @throws {Error} - Nếu instance của Socket.IO chưa được khởi tạo.
 *
 * @returns {Object} - Instance của Socket.IO server.
 */
export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO instance chưa được khởi tạo!");
  }
  return ioInstance;
};
