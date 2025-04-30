import { messageRepository } from "../repository/message.repository.js";
import { messageFormatted } from "../utils/message.utils.js";

export const messageService = {
    create: async (matchId, senderId, receiverId, content) => {
        const message = await messageRepository.create(
            matchId,
            senderId,
            receiverId,
            content
        );
        const result = messageFormatted(message);
        return result;
    },
    getAll: async (matchId) => {
        const messages = await messageRepository.getAll(matchId);
        const result = messages.map((message) => messageFormatted(message));
        return result;
    },
};
