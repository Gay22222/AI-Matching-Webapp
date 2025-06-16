import { matchRepository } from "../repository/match.repository.js";
import logger from "../utils/logger.js";

export const messageMiddleware = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const userId = parseInt(req.user.id); // Đảm bảo userId là number

    if (!matchId) {
      logger.warn("Match ID missing in request");
      return res.status(400).json({ statusCode: 400, message: "Match ID required" });
    }

    const match = await matchRepository.get(parseInt(matchId));
    if (!match) {
      logger.warn(`Match ${matchId} not found`);
      return res.status(404).json({ statusCode: 404, message: "Match not found" });
    }

    logger.info(`Match ${matchId} found:`, {
      user_1_id: match.user_1_id,
      user_2_id: match.user_2_id,
      userId,
    });

    const isParticipant = match.user_1_id === userId || match.user_2_id === userId;
    if (!isParticipant) {
      logger.warn(`User ${userId} is not a participant in match ${matchId}`);
      return res.status(403).json({ statusCode: 403, message: "Access denied" });
    }

    req.match = match;
    next();
  } catch (error) {
    logger.error({ error, stack: error.stack }, "Error in message middleware");
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};