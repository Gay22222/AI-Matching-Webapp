import prisma from '../prisma/client.js';
import logger from '../utils/logger.js';

export const messageRepository = {
  async getAll(matchId) {
    try {
      logger.info(`Fetching messages for match ${matchId}`);
      const messages = await prisma.messages.findMany({
        where: { match_id: parseInt(matchId) },
        select: {
          id: true,
          content: true,
          sent_at: true,
          sender_id: true, // Lấy trực tiếp sender_id
          receiver_id: true, // Lấy trực tiếp receiver_id
          sender: { select: { id: true, display_name: true } },
          receiver: { select: { id: true, display_name: true } }
        },
        orderBy: { sent_at: 'asc' },
        take: 100
      });
      logger.debug(`Raw messages for match ${matchId}: ${JSON.stringify(messages, null, 2)}`);
      return messages;
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error fetching messages');
      throw error;
    }
  },
  async create(matchId, senderId, receiverId, content) {
    try {
      logger.info(`Creating message for match ${matchId}`);
      const message = await prisma.messages.create({
        data: {
          sender_id: parseInt(senderId),
          receiver_id: parseInt(receiverId),
          match_id: parseInt(matchId),
          content
        },
        select: {
          id: true,
          content: true,
          sent_at: true,
          sender_id: true, // Lấy trực tiếp sender_id
          receiver_id: true, // Lấy trực tiếp receiver_id
          sender: { select: { id: true, display_name: true } },
          receiver: { select: { id: true, display_name: true } }
        }
      });
      logger.debug(`Created message: ${JSON.stringify(message, null, 2)}`);
      return message;
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error creating message');
      throw error;
    }
  }
};