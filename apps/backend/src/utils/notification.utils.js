export const formatNotification = (notification) => {
    console.log(notification?.is_read);

    return {
        id: notification?.id,
        type: notification?.type,
        user: {
            name: notification?.sender?.display_name,
            photo: notification?.sender?.Bio?.Photo,
        },
        time: notification?.created_at,
        read: notification?.is_read,
        matchId: notification?.entity_id,
    };
};
