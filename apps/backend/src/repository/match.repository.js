import prisma from "../prisma/client.js";

export const matchRepository = {
    create: (senderId, receiverId) => {
        return prisma.matches.create({
            data: {
                user_1_id: parseInt(senderId),
                user_2_id: parseInt(receiverId),
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
                    },
                },
                user_match_2: {
                    select: {
                        id: true,
                        display_name: true,
                    },
                },
            },
            where: {
                OR: [{ user_1_id: userId }, { user_2_id: userId }],
            },
        });
    },
    get: (senderId, receiverId) => {
        return prisma.matches.findFirst({
            where: {
                OR: [
                    { user_1_id: senderId, user_2_id: receiverId },
                    { user_2_id: receiverId, user_2_id: senderId },
                ],
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
            },
        });
    },
};
