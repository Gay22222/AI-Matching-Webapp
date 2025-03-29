import { findRoomById } from "../models/room.models.js";

export const roomMiddleware = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;
        console.log("middleware", roomId);

        if (!roomId) return;
        const room = await findRoomById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        console.log("middleware", room);

        const isParticipant =
            room.user_1_id === userId || room.user_2_id === userId;
        if (!isParticipant) {
            console.log(
                "Participant: ",
                room.user_1_id,
                room.user_2_id,
                "not:",
                userId
            );
            return res.status(403).json({ message: "Access denied" });
        }
        req.room = room;
        console.log("req", req.room);

        next();
    } catch (error) {
        console.error("Error in room middleware:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};
