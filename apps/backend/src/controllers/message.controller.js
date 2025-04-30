import { messageService } from "../services/message.service.js";

export const messageController = {
    create: async (req, res) => {
        const { senderId, receiverId, matchId, content } = req.body;
        if (!senderId || !receiverId || !matchId || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const message = await messageService.create(
                senderId,
                receiverId,
                matchId,
                content
            );
            return res.status(201).json({
                statusCode: 201,
                message: "Message sent",
                data: message,
            });
        } catch (error) {
            console.log(error);
            if (error.message === "Cannot create match") {
                return res.status(500).json({ error: error.message });
            }
            return res.status(500).json({ error: "Failed to send message" });
        }
    },
    getAll: async (req, res) => {
        try {
            const { matchId } = req.params;

            const messages = await messageService.getAll(parseInt(matchId));
            res.json(messages);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ error: "Failed to retrieve messages" });
        }
    },
};
