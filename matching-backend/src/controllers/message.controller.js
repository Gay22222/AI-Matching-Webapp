import Joi from 'joi';
import { messageService } from '../services/message.service.js';
import logger from '../utils/logger.js';

const createMessageSchema = Joi.object({
  receiverId: Joi.number().integer().positive().required(),
  matchId: Joi.number().integer().positive().required(),
  content: Joi.string().min(1).required()
}).unknown(true); // Cho phép các trường thừa

export const messageController = {
  async create(req, res) {
    try {
      logger.debug(`Create message input: ${JSON.stringify(req.body, null, 2)}`); // Debug
      const { error, value } = createMessageSchema.validate(req.body);
      if (error) {
        logger.warn({ error }, 'Invalid message creation input');
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      const { receiverId, matchId, content } = value;
      const senderId = req.user.id;
      logger.info(`Creating message for match ${matchId}`);
      const message = await messageService.create(matchId, senderId, receiverId, content);
      return res.status(201).json({ statusCode: 201, data: message });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error creating message');
      return res.status(500).json({ statusCode: 500, message: 'Failed to send message' });
    }
  },
  async getAll(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user.id;
      logger.info(`Fetching messages for match ${matchId}, user ${userId}`);
      const messages = await messageService.getAll(parseInt(matchId), userId);
      logger.info(`Retrieved ${messages.messages.length} messages for match ${matchId}`);
      return res.status(200).json({ statusCode: 200, data: messages });
    } catch (error) {
      logger.error({ error, stack: error.stack }, `Error fetching messages for match ${req.params.matchId}`);
      if (error.message === 'Match not found' || error.message === 'Receiver not found') {
        return res.status(404).json({ statusCode: 404, message: error.message });
      }
      return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve messages' });
    }
  }
};