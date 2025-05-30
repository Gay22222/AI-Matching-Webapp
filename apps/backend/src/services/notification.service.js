import { notificationRepository } from "../repository/notification.repository.js";
import { formatNotification } from "../utils/notification.utils.js";

export const notificationService = {
    getAll: async (userId) => {
        const notifications = await notificationRepository.getAll(userId);
        const notificationFormatted = notifications.map((notification) =>
            formatNotification(notification)
        );
        const notificationsId = notificationFormatted.map(
            (notification) => notification.id
        );

        if (notificationsId.length > 0) {
            try {
                notificationService
                    .bulkUpdate(notificationsId)
                    .catch((error) => {
                        console.error(
                            "[NotificationService] Error in bulkUpdate:",
                            error
                        );
                    });
            } catch (error) {
                console.error(
                    "[NotificationService] Error marking notifications as read:",
                    error
                );
                // Note: We're not throwing the error here to ensure the function still returns the notifications
            }
        }

        return notificationFormatted;
    },
    create: (senderId, receiverId, entityId, type) => {
        try {
            return notificationRepository.create(
                senderId,
                receiverId,
                entityId,
                type
            );
        } catch (error) {
            throw new Error("Cannot create notification: " + error.message);
        }
    },
    update: (id) => {
        try {
            return notificationRepository.update(id);
        } catch (error) {
            throw new Error("Cannot update notification: " + error.message);
        }
    },
    bulkUpdate: (ids) => {
        try {
            return notificationRepository.bulkUpdate(ids);
        } catch (error) {
            throw new Error(
                "Cannot bulk update notifications: " + error.message
            );
        }
    },
};
