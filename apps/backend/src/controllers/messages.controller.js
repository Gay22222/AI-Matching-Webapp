
/*----------------------------------------*/
	/*Gay22222 begin-section*/
/*----------------------------------------*/

import { sendMessageService, getMessagesService } from "../services/messages.service.js";

/**
 * API gửi tin nhắn
 */
export const sendMessage = async (req, res) => {
    const { sender_id, receiver_id, match_id, content } = req.body;
    if (!sender_id || !receiver_id || !match_id || !content) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const message = await sendMessageService(sender_id, receiver_id, match_id, content);
        res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
};

/**
 * API lấy danh sách tin nhắn dựa trên match_id
 */
export const getMessages = async (req, res) => {
    const { match_id } = req.query;
    if (!match_id) {
        return res.status(400).json({ error: "Match ID is required" });
    }

    try {
        const messages = await getMessagesService(parseInt(match_id));
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
};

/*----------------------------------------*/
	/*Gay22222 end-section*/
/*----------------------------------------*/