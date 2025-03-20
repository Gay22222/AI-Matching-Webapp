const messages = [];

/**
 * Lưu tin nhắn vào in-memory storage
 */
export const sendMessageService = async (sender, receiver, content) => {
    const message = { id: messages.length + 1, sender, receiver, content, timestamp: new Date() };
    messages.push(message);
    return message;
};

/**
 * Lấy tin nhắn theo user
 */
export const getMessagesService = async (user) => {
    return messages.filter(msg => msg.sender === user || msg.receiver === user);
};
