import prisma from "../prisma/client.js";

export const matchRepository = {
    create: (senderId, receiverId) => {
        return prisma.matches.create({
            data: {
                user_1_id: parseInt(senderId),
                user_2_id: parseInt(receiverId),
                matched_at: new Date(),
            },
        });
    },
    getAll: (userId) => {
        return prisma.matches.findMany({
            include: {
                user_match_1: {
                    select: {
                        id: true,
                        display_name: true,
                        Bio: {
                            select: {
                                Photo: true,
                                age: true,
                            },
                        },
                    },
                },
                user_match_2: {
                    select: {
                        id: true,
                        display_name: true,
                        Bio: {
                            select: {
                                Photo: true,
                                age: true,
                            },
                        },
                    },
                },
            },
            where: {
                OR: [{ user_1_id: userId }, { user_2_id: userId }],
            },
        });
    },
    get: (id) => {
        return prisma.matches.findFirst({
            where: {
                id,
            },
            include: {
                user_match_1: {
                    select: {
                        id: true,
                        display_name: true,
                    },
                },
                user_match_2: {
                    select: {
                        id: true,
                        display_name: true,
                    },
                },
                messages: {
                    orderBy: { sent_at: "desc" },
                    select: {
                        id: true,
                        content: true,
                        sent_at: true,
                        sender: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                        receiver: {
                            select: {
                                id: true,
                                display_name: true,
                            },
                        },
                    },
                },
            },
        });
    },
    find: async (senderId, receiverId) => {
        return prisma.matches.findFirst({
            where: {
                OR: [
                    {
                        user_1_id: parseInt(senderId),
                        user_2_id: parseInt(receiverId),
                    },
                    {
                        user_1_id: parseInt(receiverId),
                        user_2_id: parseInt(senderId),
                    },
                ],
            },
        });
    },
};
