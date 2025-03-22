import prisma from "../prisma/client.js";

/**
 * Gửi tin nhắn giữa hai người dùng.
 */
export const sendMessageService = async (sender_id, receiver_id, match_id, content) => {
    const message = await prisma.message.create({
        data: {
            sender_id,
            receiver_id,
            match_id,
            content
        }
    });
    return message;
};

/**
 * Lấy danh sách tin nhắn giữa hai người dùng dựa vào match_id
 */
export const getMessagesService = async (match_id) => {
    const messages = await prisma.message.findMany({
        where: { match_id },
        orderBy: { timestamp: "asc" }
    });
    return messages;
};
