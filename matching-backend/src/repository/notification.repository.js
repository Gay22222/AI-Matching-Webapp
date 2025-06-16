import prisma from '../prisma/client.js';
import logger from '../utils/logger.js';

export const notificationRepository = {
  async create(senderId, receiverId, entityId, type) {
    try {
      logger.info(`Creating notification for receiver ${receiverId}`);
      return await prisma.notifications.create({
        data: {
          sender_id: parseInt(senderId),
          receiver_id: parseInt(receiverId),
          entity_id: parseInt(entityId),
          type
        },
        select: {
          id: true,
          type: true,
          entity_id: true,
          created_at: true,
          is_read: true,
          is_hidden: true,
          sender: { select: { id: true, display_name: true } },
          receiver: { select: { id: true } }
        }
      });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error creating notification');
      throw error;
    }
  },
  async getAll(userId) {
    try {
      logger.info(`Fetching notifications for user ${userId}`);
      return await prisma.notifications.findMany({
        where: {
          AND: [{ receiver_id: parseInt(userId) }, { is_hidden: false }]
        },
        select: {
          id: true,
          type: true,
          entity_id: true,
          created_at: true,
          is_read: true,
          is_hidden: true,
          sender: {
            select: {
              id: true,
              display_name: true,
              Bio: {
                select: {
                  age: true,
                  Photo: { where: { is_profile_pic: true }, select: { url: true }, take: 1 }
                }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
        take: 50 // Giới hạn số thông báo
      });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error fetching notifications');
      throw error;
    }
  },
  async update(id) {
    try {
      logger.info(`Updating notification ${id}`);
      return await prisma.notifications.update({
        where: { id: parseInt(id) },
        data: { is_hidden: true },
        select: { id: true, is_hidden: true }
      });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error updating notification');
      throw error;
    }
  }
};