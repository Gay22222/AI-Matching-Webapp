

import { sendMessageService, getMessagesService } from "../services/messages.service.js";

/**
 * API gửi tin nhắn
 */
export const sendMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;
    if (!sender || !receiver || !content) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const message = await sendMessageService(sender, receiver, content);
    res.status(201).json({ message: "Message sent", data: message });
};

/**
 * API lấy danh sách tin nhắn theo user
 */
export const getMessages = async (req, res) => {
    const { user } = req.query;
    if (!user) {
        return res.status(400).json({ error: "User parameter is required" });
    }

    const messages = await getMessagesService(user);
    res.json(messages);
};

