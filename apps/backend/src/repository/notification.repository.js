import prisma from "../prisma/client.js";

export const notificationRepository = {
    create: (senderId, receiverId, entityId, type) => {
        return prisma.notifications.create({
            data: {
                sender_id: parseInt(senderId),
                receiver_id: parseInt(receiverId),
                entity_id: parseInt(entityId),
                type,
            },
        });
    },
    getAll: (userId) => {
        return prisma.notifications.findMany({
            include: {
                sender: {
                    select: {
                        id: true,
                        display_name: true,
                        Bio: {
                            select: {
                                Photo: {
                                    select: {
                                        url: true,
                                    },
                                    where: {
                                        is_profile_pic: true,
                                    },
                                },
                                age: true,
                            },
                        },
                    },
                },
            },
            where: {
                AND: [{ receiver_id: parseInt(userId) }, { is_hidden: false }],
            },
            orderBy: { created_at: "desc" },
        });
    },
    update: (id) => {
        return prisma.notifications.update({
            where: { id: parseInt(id) },
            data: { is_hidden: true },
        });
    },
    bulkUpdate: (ids) => {
        return prisma.notifications.updateMany({
            where: { id: { in: ids.map((id) => parseInt(id)) } },
            data: { is_read: true },
        });
    },
};
