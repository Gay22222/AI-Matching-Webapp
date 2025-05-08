import { matchRepository } from "../repository/match.repository.js";

export const matchService = {
    get: (id) => {
        console.log("match service", id);

        return matchRepository.get(parseInt(id));
    },
    getAll: (userId) => {
        return matchRepository.getAll(userId);
    },
    create: async (senderId, receiverId) => {
        const isExistMatch = await matchRepository.get(senderId, receiverId);

        if (isExistMatch) {
            throw new Error("The match has already been created");
        }

        try {
            return await matchRepository.create(senderId, receiverId);
        } catch (error) {
            throw new Error("Cannot create match");
        }
    },
};
