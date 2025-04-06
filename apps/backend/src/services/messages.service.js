/*----------------------------------------*/
/*Gay22222 begin-section*/
/*----------------------------------------*/

import prisma from "../prisma/client.js";

/**
 * Gửi tin nhắn giữa hai người dùng.
 *
 * @function sendMessageService
 * @description Tạo một tin nhắn mới giữa hai người dùng và lưu vào cơ sở dữ liệu.
 *
 * @param {number} sender_id - ID của người gửi tin nhắn.
 * @param {number} receiver_id - ID của người nhận tin nhắn.
 * @param {number} match_id - ID của cặp ghép đôi.
 * @param {string} content - Nội dung tin nhắn.
 *
 * @returns {Object} - Trả về đối tượng tin nhắn đã được tạo.
 */
export const sendMessageService = async ({
    sender_id,
    receiver_id,
    match_id,
    content,
}) => {
    const message = await prisma.message.create({
        data: {
            sender_id: parseInt(sender_id),
            receiver_id: parseInt(receiver_id),
            match_id: parseInt(match_id),
            content,
        },
        include: {
            sender_message_id: {
                select: {
                    id: true,
                    display_name: true,
                },
            },
            receiver_message_id: {
                select: {
                    id: true,
                    display_name: true,
                },
            },
        },
    });
    const formattedMessage = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        match_id: message.match_id,
        sender: {
            id: message.sender_message_id.id,
            display_name: message.sender_message_id.display_name,
        },
        receiver: {
            id: message.receiver_message_id.id,
            display_name: message.receiver_message_id.display_name,
        },
    };
    return formattedMessage;
};

/**
 * Lấy danh sách tin nhắn giữa hai người dùng dựa vào match_id.
 *
 * @function getMessagesService
 * @description Truy vấn danh sách tin nhắn giữa hai người dùng từ cơ sở dữ liệu dựa vào `match_id`.
 *
 * @param {number} match_id - ID của cặp ghép đôi để lấy danh sách tin nhắn.
 *
 * @returns {Array<Object>} - Trả về danh sách các tin nhắn, được sắp xếp theo thứ tự thời gian tăng dần.
 */
export const getMessagesService = async (match_id) => {
    const messages = await prisma.message.findMany({
        where: { match_id },
        orderBy: { timestamp: "asc" },
        include: {
            sender_message_id: {
                select: {
                    id: true,
                    display_name: true,
                },
            },
            receiver_message_id: {
                select: {
                    id: true,
                    display_name: true,
                },
            },
        },
    });
    const messagesFormatted = messages.map((message) => ({
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        match_id: message.match_id,
        sender: {
            id: message.sender_message_id.id,
            display_name: message.sender_message_id.display_name,
        },
        receiver: {
            id: message.receiver_message_id.id,
            display_name: message.receiver_message_id.display_name,
        },
    }));

    return messagesFormatted;
};

/*----------------------------------------*/
/*Gay22222 end-section*/
/*----------------------------------------*/
