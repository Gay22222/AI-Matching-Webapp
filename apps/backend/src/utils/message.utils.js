export const messageFormatted = (message) => ({
    id: message?.id,
    content: message?.content,
    timestamp: message?.timestamp,
    match_id: message?.match_id,
    sender: {
        id: message?.sender?.id,
        display_name: message?.sender?.display_name,
    },
    receiver: {
        id: message?.receiver?.id,
        display_name: message?.receiver?.display_name,
    },
});
