export const formatNotification = (notification) => {
    return {
        id: notification?.id,
        type: notification?.type,
        user: {
            name: notification?.sender?.display_name,
            photo: notification?.sender?.Bio?.Photo,
        },
        time: notification?.created_at,
        read: false,
        matchId: notification?.entity_id,
    };
};
