import prisma from "../prisma/client.js";

export const findRoomById = async (match_id) => {
    console.log(match_id, "Phòng");
    if (!match_id) return null;
    const room = await prisma.matches.findUnique({
        where: {
            id: parseInt(match_id),
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
    const roomFormatted = {
        id: room?.id,
        user_1_id: room?.user_match_1,
        user_2_id: room?.user_match_2,
        user_1: room?.user_match_1,
        user_2: room?.user_match_2,
        is_active: room?.is_active,
    };
    return room;
};

export const findRoom = async (senderId, receiverId) => {
    const existingRoom = await prisma.matches.findFirst({
        where: {
            OR: [
                {
                    AND: [
                        {
                            user_1_id: parseInt(senderId),
                        },
                        {
                            user_2_id: parseInt(receiverId),
                        },
                    ],
                },
                {
                    AND: [
                        {
                            user_1_id: parseInt(receiverId),
                        },
                        {
                            user_2_id: parseInt(senderId),
                        },
                    ],
                },
            ],
        },
    });
    return existingRoom;
};

export const createRoom = async (data) => {
    const { senderId, receiverId } = data;
    console.log(senderId, receiverId, "Tạo phòng");
    if (!senderId || !receiverId) return null;

    const isExistRoom = await findRoom(senderId, receiverId);

    console.log(isExistRoom);

    if (isExistRoom) return isExistRoom;

    return await prisma.matches.create({
        data: {
            user_1_id: parseInt(senderId),
            user_2_id: parseInt(receiverId),
        },
    });
};
