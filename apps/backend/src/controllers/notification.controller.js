import { notificationService } from "../services/notification.service.js";

export const notificationController = {
    // [GET] /notifications
    getAll: async (req, res) => {
        try {
            const userId = req?.user?.id;
            const notifications = await notificationService.getAll(userId);
            res.status(200).json({
                statusCode: 200,
                data: notifications,
            });
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
    // [POST] /notifications
    create: async (req, res) => {
        try {
            const { receiverId, entityId, type } = req.body;
            const senderId = req?.user?.id;

            if (!receiverId || !senderId || !entityId || !type) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Missing required fields",
                });
            }
            const notification = await notificationService.create(
                senderId,
                receiverId,
                entityId,
                type
            );
            res.status(201).json({
                statusCode: 201,
                data: notification,
            });
        } catch (error) {
            console.error("Error creating notification:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
};
