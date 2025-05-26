export const messageFormatted = (message, userId) => ({
    id: message?.id,
    text: message?.content,
    time: message?.sent_at,
    sender: userId === message?.sender_id ? "me" : "them",
});
