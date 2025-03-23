import prisma from "../prisma/client.js";


/**
 * Lấy danh sách tin nhắn giữa hai người dùng dựa vào match_id.
 *
 * @function getMessagesService
 * @description Truy vấn danh sách tin nhắn giữa hai người dùng từ cơ sở dữ liệu dựa vào `match_id`.
 *
 * @param {number} match_id - ID của cặp ghép đôi để lấy danh sách tin nhắn.
 *
 * @returns {Array<Object>} - Trả về danh sách các tin nhắn, được sắp xếp theo thứ tự thời gian tăng dần.
 */
export const createNotificationService = async ({ recipient_id, sender_id, type, content }) => {
  return prisma.notification.create({
    data: {
      recipient_id,
      sender_id,
      type,
      content,
    },
  });
};
/**
 * Lấy danh sách thông báo của người dùng.
 *
 * @function getUserNotificationsService
 * @description Truy vấn danh sách thông báo của một người dùng từ cơ sở dữ liệu.
 *
 * @param {number} userId - ID của người dùng cần lấy thông báo.
 *
 * @returns {Array<Object>} - Trả về danh sách thông báo, được sắp xếp theo thứ tự thời gian giảm dần.
 */
export const getUserNotificationsService = async (userId) => {
  return prisma.notification.findMany({
    where: { recipient_id: userId },
    orderBy: { created_at: "desc" },
    take: 50,
  });
};
/**
 * Đánh dấu thông báo là đã đọc.
 *
 * @function markNotificationAsReadService
 * @description Cập nhật trạng thái của một thông báo thành "đã đọc".
 *
 * @param {number} id - ID của thông báo cần đánh dấu là đã đọc.
 *
 * @returns {Object} - Trả về đối tượng thông báo đã được cập nhật.
 */
export const markNotificationAsReadService = async (id) => {
  return prisma.notification.update({
    where: { id },
    data: { is_read: true },
  });
};
