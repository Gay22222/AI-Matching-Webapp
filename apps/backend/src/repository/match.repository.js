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
                AND: [
                    { OR: [{ user_1_id: userId }, { user_2_id: userId }] },
                    { is_accept: true },
                ],
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
                        Bio: {
                            select: {
                                Photo: {
                                    where: {
                                        is_profile_pic: true,
                                    },
                                    select: {
                                        url: true,
                                    },
                                    take: 1,
                                },
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
                                Photo: {
                                    where: {
                                        is_profile_pic: true,
                                    },
                                    select: {
                                        url: true,
                                    },
                                    take: 1,
                                },
                            },
                        },
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
    find: (senderId, receiverId) => {
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
    update: (id, isAccept) => {
        return prisma.matches.update({
            where: { id },
            data: { is_accept: isAccept },
        });
    },
};
