import prisma from "../prisma/client.js";

export const messageRepository = {
    // get messages
    getAll: (matchId) => {
        return prisma.messages.findMany({
            include: {
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
            where: {
                match_id: matchId,
            },
            orderBy: {
                sent_at: "asc",
            },
        });
    },
    // create new message
    create: (matchId, senderId, receiverId, content) => {
        console.log(matchId, senderId, receiverId, content);

        return prisma.messages.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                match_id: matchId,
                content,
            },
            include: {
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
        });
    },
    // enhance....
    // edit message
    // delete message
};
