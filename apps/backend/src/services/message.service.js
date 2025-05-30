import { matchRepository } from "../repository/match.repository.js";
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
    getAll: async (matchId, userId) => {
        const messages = await messageRepository.getAll(matchId);
        const match = await matchRepository.get(matchId);
        const receiver =
            match.user_1_id === userId
                ? match.user_match_2
                : match.user_match_1;
        const result = messages.map((message) =>
            messageFormatted(message, userId)
        );

        return {
            id: receiver.id,
            name: receiver.display_name,
            photo: receiver.Bio?.Photo?.[0] || "",
            messages: result,
        };
    },
};
