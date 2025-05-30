import { matchRepository } from "../repository/match.repository.js";
import { matchService } from "../services/match.service.js";

export const matchMiddleware = async (req, res, next) => {
    try {
        const { matchId } = req.params;

        const userId = req.user.id;

        if (!matchId)
            return res.status(404).json({ message: "Match not found" });
        const match = await matchService.get(matchId);
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        const isParticipant =
            match.user_1_id === userId || match.user_2_id === userId;
        if (!isParticipant) {
            return res.status(403).json({ message: "Access denied" });
        }
        req.match = match;

        next();
    } catch (error) {
        console.error("Error in match middleware:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};
