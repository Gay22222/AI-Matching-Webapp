// src/services/match.service.js

import { matchRepository } from "../repository/match.repository.js";
import { notificationService } from "../services/notification.service.js";
import logger from "../utils/logger.js";

export const matchService = {
  get: (id) => {
    return matchRepository.get(parseInt(id));
  },

  getAll: async (userId, isAccept = true) => {
    logger.info(`Fetching matches for user ${userId}`);
    const matches = await matchRepository.getAll(userId, isAccept);
    logger.debug(`Raw matches data for user ${userId}: ${JSON.stringify(matches, null, 2)}`);
    return matches
      .map((match) => {
        const otherUser =
          match.user_1_id === userId ? match.user_match_2 : match.user_match_1;

        if (!otherUser) {
          logger.warn(`No other user found for match ${match.id}, userId ${userId}`);
          return null;
        }

        // Lấy ảnh đại diện từ mảng Photo
        const photo = otherUser.Bio?.Photo?.find(p => p?.is_profile_pic)?.url || otherUser.Bio?.Photo?.[0]?.url || "";

        const result = {
          id: match.id,
          user_id: otherUser.id,
          name: otherUser.display_name || "Không có tên",
          age: otherUser.Bio?.age || 0,
          matchTime: match.matched_at
            ? new Date(match.matched_at).toLocaleDateString()
            : "Hôm nay",
          photo,
          unread: false,
        };

        logger.debug(`Formatted match for user ${userId}: ${JSON.stringify(result, null, 2)}`);
        return result;
      })
      .filter((match) => match !== null);
  },

  create: async (senderId, receiverId) => {
    if (senderId === receiverId) {
      throw new Error("Cannot create match with the same user");
    }
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
        match.user_1_id === receiverId ? match.user_2_id : match.user_1_id;

      if (isAccept) {
        await notificationService.create(senderId, receiverId, match.id, "NEW_MATCH");
        await notificationService.create(receiverId, senderId, match.id, "NEW_MATCH");
        await notificationService.update(notificationId);
        return match;
      }
    } catch (error) {
      logger.error("Error updating match:", error);
    }
  },
};