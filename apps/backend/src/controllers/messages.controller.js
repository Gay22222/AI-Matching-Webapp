/*----------------------------------------*/
/*Gay22222 begin-section*/
/*----------------------------------------*/

import {
    sendMessageService,
    getMessagesService,
} from "../services/messages.service.js";

/**
 * API gửi tin nhắn
 *
 * @function sendMessage
 * @description Xử lý yêu cầu gửi tin nhắn giữa hai người dùng.
 *
 * @param {Object} req - Đối tượng request từ client.
 * @param {Object} req.body - Dữ liệu gửi từ client.
 * @param {number} req.body.sender_id - ID của người gửi tin nhắn.
 * @param {number} req.body.receiver_id - ID của người nhận tin nhắn.
 * @param {number} req.body.match_id - ID của cặp ghép đôi.
 * @param {string} req.body.content - Nội dung tin nhắn.
 *
 * @param {Object} res - Đối tượng response để trả kết quả về client.
 *
 * @returns {Object} - Trả về JSON chứa thông tin tin nhắn đã gửi hoặc lỗi.
 */
export const sendMessage = async (req, res) => {
    const { sender_id, receiver_id, match_id, content } = req.body;
    if (!sender_id || !receiver_id || !match_id || !content) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const message = await sendMessageService(
            sender_id,
            receiver_id,
            match_id,
            content
        );
        res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
};

/**
 * API lấy danh sách tin nhắn dựa trên match_id
 *
 * @function getMessages
 * @description Xử lý yêu cầu lấy danh sách tin nhắn của một cặp ghép đôi.
 *
 * @param {Object} req - Đối tượng request từ client.
 * @param {Object} req.query - Query parameters từ URL.
 * @param {number} req.query.match_id - ID của cặp ghép đôi để lấy tin nhắn.
 *
 * @param {Object} res - Đối tượng response để trả kết quả về client.
 *
 * @returns {Object} - Trả về JSON chứa danh sách tin nhắn hoặc lỗi.
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
