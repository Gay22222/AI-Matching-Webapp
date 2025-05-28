import { notificationRepository } from "../repository/notification.repository.js";
import { formatNotification } from "../utils/notification.utils.js";

export const notificationService = {
    getAll: async (userId) => {
        const notifications = await notificationRepository.getAll(userId);
        const notificationFormatted = notifications.map((notification) =>
            formatNotification(notification)
        );
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
};
