import prisma from '../prisma/client.js';
import logger from '../utils/logger.js';

export const matchRepository = {
  async getAll(userId, isAccept) {
    try {
      const matches = await prisma.matches.findMany({
        where: {
          OR: [{ user_1_id: userId }, { user_2_id: userId }],
          is_accept: isAccept,
        },
        include: {
          user_match_1: {
            include: {
              Bio: {
                include: {
                  Photo: true,
                },
              },
            },
          },
          user_match_2: {
            include: {
              Bio: {
                include: {
                  Photo: true,
                },
              },
            },
          },
        },
      });
      logger.debug(`Raw matches from Prisma for user ${userId}: ${JSON.stringify(matches, null, 2)}`);
      return matches;
    } catch (error) {
      logger.error({ error, stack: error.stack }, "Error fetching matches");
      throw error;
    }
  },

  async get(id) {
    try {
      logger.info(`Fetching match ${id}`);
      const match = await prisma.matches.findFirst({
        where: { id: parseInt(id) },
        select: {
          id: true,
          user_1_id: true,
          user_2_id: true,
          matched_at: true,
          is_accept: true,
          user_match_1: {
            select: {
              id: true,
              display_name: true,
              Bio: {
                select: {
                  Photo: { where: { is_profile_pic: true }, select: { url: true }, take: 1 }
                }
              }
            }
          },
          user_match_2: {
            select: {
              id: true,
              display_name: true,
              Bio: {
                select: {
                  Photo: { where: { is_profile_pic: true }, select: { url: true }, take: 1 }
                }
              }
            }
          },
          messages: {
            orderBy: { sent_at: 'desc' },
            select: {
              id: true,
              content: true,
              sent_at: true,
              sender: { select: { id: true, display_name: true } },
              receiver: { select: { id: true, display_name: true } }
            },
            take: 50
          }
        }
      });
      logger.info(`Match ${id} retrieved:`, JSON.stringify(match, null, 2));
      return match;
    } catch (error) {
      logger.error({ error, stack: error.stack }, `Error fetching match ${id}`);
      throw error;
    }
  },

  async find(senderId, receiverId) {
    try {
      logger.info(`Checking match between sender ${senderId} and receiver ${receiverId}`);
      return await prisma.matches.findFirst({
        where: {
          OR: [
            { user_1_id: parseInt(senderId), user_2_id: parseInt(receiverId) },
            { user_1_id: parseInt(receiverId), user_2_id: parseInt(senderId) }
          ]
        }
      });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error finding match');
      throw error;
    }
  },

  async create(senderId, receiverId) {
    try {
      logger.info(`Creating match for sender ${senderId} and receiver ${receiverId}`);
      // Kiểm tra user tồn tại
      const senderExists = await prisma.users.findUnique({ where: { id: parseInt(senderId) } });
      const receiverExists = await prisma.users.findUnique({ where: { id: parseInt(receiverId) } });
      if (!senderExists || !receiverExists) {
        logger.warn("User not found", { senderId, receiverId });
        throw new Error(`User not found: ${!senderExists ? 'sender' : 'receiver'}`);
      }

      const match = await prisma.matches.create({
        data: {
          user_1_id: parseInt(senderId),
          user_2_id: parseInt(receiverId),
          is_accept: false,
          matched_at: new Date(),
        },
        include: {
          user_match_1: {
            include: {
              Bio: {
                include: {
                  Photo: true,
                },
              },
            },
          },
          user_match_2: {
            include: {
              Bio: {
                include: {
                  Photo: true,
                },
              },
            },
          },
        },
      });
      logger.info(`Match created with ID ${match.id}`);
      return match;
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error creating match');
      throw error;
    }
  },

  async update(id, isAccept) {
    try {
      logger.info(`Updating match ${id} with isAccept ${isAccept}`);
      return await prisma.matches.update({
        where: { id: parseInt(id) },
        data: { is_accept: isAccept }
      });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error updating match');
      throw error;
    }
  }
};