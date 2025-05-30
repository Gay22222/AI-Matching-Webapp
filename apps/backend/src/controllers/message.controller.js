import { matchRepository } from "../repository/match.repository.js";
import { messageService } from "../services/message.service.js";

export const messageController = {
    create: async (req, res) => {
        const { receiverId, matchId, content } = req.body;
        const senderId = req.user.id;
        if (!receiverId || !matchId || !content) {
            return res
                .status(400)
                .json({ statusCode: 400, message: "Missing required fields" });
        }

        try {
            const message = await messageService.create(
                matchId,
                senderId,
                receiverId,
                content
            );
            return res.status(201).json({
                statusCode: 201,
                data: message,
            });
        } catch (error) {
            console.log(error);
            if (error.message === "Cannot create match") {
                return res.status(500).json({ error: error.message });
            }
            return res
                .status(500)
                .json({ error: "Failed to send message" + error });
        }
    },
    getAll: async (req, res) => {
        try {
            const { matchId } = req.params;
            const userId = req.user.id;

            const messages = await messageService.getAll(
                parseInt(matchId),
                userId
            );
            res.status(200).json({
                statusCode: 200,
                data: messages,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ error: "Failed to retrieve messages" });
        }
    },
};
