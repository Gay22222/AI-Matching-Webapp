export const messageFormatted = (message, userId) => {
  return {
    id: message.id,
    text: message.content,
    time: message.sent_at,
    sender: parseInt(message.sender_id) === parseInt(userId) ? "me" : "other",
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
  };
};