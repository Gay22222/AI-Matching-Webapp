import { matchRepository } from "../repository/match.repository.js";

export const messageMiddleware = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        if (!roomId) return res.status(404).json({ message: "Room not found" });
        const room = await matchRepository.get(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const isParticipant =
            room.user_1_id === userId || room.user_2_id === userId;
        if (!isParticipant) {
            return res.status(403).json({ message: "Access denied" });
        }
        req.room = room;

        next();
    } catch (error) {
        console.error("Error in room middleware:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};
