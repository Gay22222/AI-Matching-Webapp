import prisma from "../prisma/client.js";

export const createNotificationService = async ({ recipient_id, sender_id, type, content }) => {
  return prisma.notification.create({
    data: {
      recipient_id,
      sender_id,
      type,
      content,
    },
  });
};

export const getUserNotificationsService = async (userId) => {
  return prisma.notification.findMany({
    where: { recipient_id: userId },
    orderBy: { created_at: "desc" },
    take: 50,
  });
};

export const markNotificationAsReadService = async (id) => {
  return prisma.notification.update({
    where: { id },
    data: { is_read: true },
  });
};
