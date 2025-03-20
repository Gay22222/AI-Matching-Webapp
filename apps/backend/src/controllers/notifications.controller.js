const notifications = [];

// Gửi thông báo
export const sendNotification = (req, res) => {
    const { user, message } = req.body;
    const notification = { id: notifications.length + 1, user, message, timestamp: new Date() };
    notifications.push(notification);
    res.status(201).json({ message: "Notification sent", data: notification });
};

// Lấy danh sách thông báo
export const getNotifications = (req, res) => {
    res.json(notifications);
};
