import {
    createNotificationService,
    getUserNotificationsService,
    markNotificationAsReadService,
  } from "../services/notifications.service.js";
  
  import { getIO } from "../utils/socket.js"; //  Thêm để emit socket
  
  export const createNotificationHandler = async (req, res) => {
    const { recipient_id, sender_id, type, content } = req.body;
  
    if (!recipient_id || !type || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const notification = await createNotificationService({
        recipient_id,
        sender_id,
        type,
        content,
      });
  
      //  Emit socket realtime
      const io = getIO();
      io.to(`user:${recipient_id}`).emit("receiveNotification", notification);
  
      res.status(201).json({ message: "Notification created", data: notification });
    } catch (err) {
      console.error("Create Notification Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const getUserNotificationsHandler = async (req, res) => {
    const userId = Number(req.params.userId);
    try {
      const notifications = await getUserNotificationsService(userId);
      res.status(200).json(notifications);
    } catch (err) {
      console.error("Get Notifications Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const markAsReadHandler = async (req, res) => {
    const id = Number(req.params.id);
    try {
      const notification = await markNotificationAsReadService(id);
      res.status(200).json(notification);
    } catch (err) {
      console.error("Mark as read error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  