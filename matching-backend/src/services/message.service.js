import { matchRepository } from "../repository/match.repository.js";
import { messageRepository } from "../repository/message.repository.js";
import { messageFormatted } from "../utils/message.utils.js";
import logger from "../utils/logger.js";

export const messageService = {
  create: async (matchId, senderId, receiverId, content) => {
    logger.info(`Service: Creating message for match ${matchId}, sender ${senderId}`);
    const match = await matchRepository.get(matchId);
    if (!match) {
      logger.warn(`Match ${matchId} not found`);
      throw new Error("Match not found");
    }
    const message = await messageRepository.create(
      matchId,
      senderId,
      receiverId,
      content
    );
    const result = messageFormatted(message, senderId);
    logger.debug(`Formatted created message: ${JSON.stringify(result, null, 2)}`);
    return result;
  },
  getAll: async (matchId, userId) => {
    logger.info(`Service: Fetching messages for match ${matchId}, user ${userId}`);
    const match = await matchRepository.get(matchId);
    if (!match) {
      logger.warn(`Match ${matchId} not found`);
      throw new Error("Match not found");
    }
    const receiver =
      match.user_1_id === userId
        ? match.user_match_2
        : match.user_match_1;
    if (!receiver) {
      logger.warn(`Receiver not found for match ${matchId}`);
      throw new Error("Receiver not found");
    }
    const messages = await messageRepository.getAll(matchId);
    logger.info(`Service: Retrieved ${messages.length} messages for match ${matchId}`);
    const formattedMessages = messages.map((message) =>
      messageFormatted(message, userId)
    );
    const result = {
      id: receiver.id,
      name: receiver.display_name,
      photo: receiver.Bio?.Photo?.find(p => p?.is_profile_pic)?.url || "",
      messages: formattedMessages,
    };
    logger.debug(`Formatted messages response: ${JSON.stringify(result, null, 2)}`);
    return result;
  },
};