import { matchRepository } from "../repository/match.repository.js";
import { notificationService } from "../services/notification.service.js";

export const matchService = {
    get: (id) => {
        console.log("match service", id);

        return matchRepository.get(parseInt(id));
    },
    getAll: async (userId) => {
        return matchRepository.getAll(userId).then((matches) => {
            return matches
                .map((match) => {
                    const otherUser =
                        match.user_1_id === userId
                            ? match.user_match_2
                            : match.user_match_1;
                    if (!otherUser) return null;
                    const photo =
                        otherUser.Bio?.Photo?.[0]?.url ||
                        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80";
                    return {
                        id: match.id,
                        name: otherUser.display_name,
                        age: otherUser.Bio?.age || 0,
                        matchTime: match.matched_at
                            ? new Date(match.matched_at).toLocaleDateString()
                            : "Hôm nay",
                        photo,
                        unread: false,
                    };
                })
                .filter((match) => match !== null);
        });
    },
    create: async (senderId, receiverId) => {
        const isExistMatch = await matchRepository.find(senderId, receiverId);

        if (isExistMatch) {
            throw new Error("The match has already been created");
        }

        try {
            const match = await matchRepository.create(senderId, receiverId);

            const notification = await notificationService.create(
                senderId,
                receiverId,
                match.id,
                "LIKED"
            );

            if (!notification) {
                throw new Error("Cannot create notification");
            }

            return match;
        } catch (error) {
            throw new Error("Cannot create match");
        }
    },
    update: async (id, isAccept, receiverId, notificationId) => {
        try {
            const match = await matchRepository.update(parseInt(id), isAccept);

            const senderId =
                match.user_1_id === receiverId
                    ? match.user_2_id
                    : match.user_1_id;

            if (isAccept) {
                const notificationForReceiver =
                    await notificationService.create(
                        senderId,
                        receiverId,
                        match.id,
                        "NEW_MATCH"
                    );

                const notificationForSender = await notificationService.create(
                    receiverId,
                    senderId,
                    match.id,
                    "NEW_MATCH"
                );

                const notification = await notificationService.update(
                    notificationId
                );

                return match;
            }
            console.log("update match", id, isAccept);
        } catch (error) {
            console.log("Error updating match:", error);
        }
    },
};
