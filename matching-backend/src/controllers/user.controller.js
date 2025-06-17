import { userService } from "../services/user.service.js";
import logger from "../utils/logger.js";
import Joi from "joi";

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const filterSchema = Joi.object({
  page: Joi.number().integer().positive().default(1),
  limit: Joi.number().integer().positive().default(10),
  search: Joi.string().allow("").optional(),
  gender: Joi.string().valid("male", "female", "other").allow("").optional(),
  ageMin: Joi.number().integer().min(18).allow(null).optional(),
  ageMax: Joi.number().integer().max(100).allow(null).optional(),
  languageIds: Joi.string().allow("").optional(),
  educationIds: Joi.string().allow("").optional(),
  zodiacIds: Joi.string().allow("").optional(),
  characterIds: Joi.string().allow("").optional(),
  communicateStyleIds: Joi.string().allow("").optional(),
  loveLanguageIds: Joi.string().allow("").optional(),
  futureFamilyIds: Joi.string().allow("").optional(),
  sexualOrientationIds: Joi.string().allow("").optional(),
  petIds: Joi.string().allow("").optional(),
  dietIds: Joi.string().allow("").optional(),
  sleepIds: Joi.string().allow("").optional(),
  snuIds: Joi.string().allow("").optional(),
  searchingForIds: Joi.string().allow("").optional(),
  currentUserId: Joi.number().integer().positive().optional(),
});

const updateUserSchema = Joi.object({
  user: Joi.object({
    id: Joi.number().integer().positive().required(),
    displayName: Joi.string().allow(""),
    gender: Joi.string().valid("male", "female", "other").allow(""),
    preferredGender: Joi.string().valid("male", "female", "other").allow(""),
    name: Joi.string().allow(""),
    age: Joi.number().integer().min(18).allow(null),
    aboutMe: Joi.string().allow(""),
    height: Joi.number().integer().allow(null),
    location: Joi.string().allow(""),
    birthday: Joi.date().allow(null),
    languageId: Joi.number().integer().positive().allow(null),
    religionId: Joi.number().integer().positive().allow(null),
    careerId: Joi.number().integer().positive().allow(null),
    educationId: Joi.number().integer().positive().allow(null),
    zodiacId: Joi.number().integer().positive().allow(null),
    characterId: Joi.number().integer().positive().allow(null),
    communicateStyleId: Joi.number().integer().positive().allow(null),
    loveLanguageId: Joi.number().integer().positive().allow(null),
    futureFamilyId: Joi.number().integer().positive().allow(null),
    drink: Joi.boolean().allow(null),
    smoke: Joi.boolean().allow(null),
    train: Joi.boolean().allow(null),
    petId: Joi.number().integer().positive().allow(null),
    dietId: Joi.number().integer().positive().allow(null),
    sleepId: Joi.number().integer().positive().allow(null),
    snuId: Joi.number().integer().positive().allow(null),
    favorites: Joi.array().items(Joi.number().integer().positive()).allow(null),
    maxRadius: Joi.number().integer().positive().allow(null),
    photos: Joi.array().items(
      Joi.object({
        id: Joi.number().integer().positive().allow(null),
        url: Joi.string().allow(""),
        is_profile_pic: Joi.boolean().allow(null),
      })
    ).allow(null),
  }).required(),
});

export const userController = {
  async getAll(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn("User ID is required but not provided");
        return res.status(400).json({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      // Xác thực bộ lọc
      const { error, value } = filterSchema.validate(req.query, { abortEarly: false });
      if (error) {
        logger.warn({ error: error.details }, "Invalid filter input");
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid filter parameters",
          error: { details: error.details },
        });
      }

      logger.info(`Fetching users with filters: ${JSON.stringify(value)} for userId ${userId}`);
      const users = await userService.getAllUsersFormatted(value, userId);

      res.status(200).json({
        statusCode: 200,
        users,
      });
    } catch (error) {
      logger.error({ error, stack: error.stack }, "Error fetching users");
      res.status(500).json({
        statusCode: 500,
        message: error.message || "Internal server error",
      });
    }
  },
  getProfile: async (req, res) => {
    try {
      logger.info("Fetching profile for user:", req.user?.id);
      const user = await userService.getProfileById(req.user.id);
      if (!user) {
        logger.warn(`User not found: ${req.user.id}`);
        return res.status(404).json({ statusCode: 404, message: "User not found" });
      }
      res.status(200).json({
        statusCode: 200,
        user,
      });
    } catch (error) {
      logger.error("Error getting profile:", {
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({
        statusCode: 500,
        message: error.message || "Internal server error",
      });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const { error, value } = idSchema.validate(req.params);
      if (error) {
        logger.warn({ error }, "Invalid user ID");
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      const userId = value.id;
      const currentUserId = req.user?.id;
      if (!currentUserId) {
        logger.error("User not authenticated");
        return res.status(401).json({ statusCode: 401, message: "User not authenticated" });
      }
      logger.info(`Fetching user info for ID: ${userId} by user: ${currentUserId}`);
      const user = await userService.getUserById(userId);
      if (!user) {
        logger.warn(`User not found: ${userId}`);
        return res.status(404).json({ statusCode: 404, message: "User not found" });
      }
      res.status(200).json({
        statusCode: 200,
        user,
      });
    } catch (error) {
      logger.error("Error getting user info:", {
        message: error.message,
        stack: error.stack,
        userId: req.params.id,
      });
      res.status(500).json({
        statusCode: 500,
        message: error.message || "Internal server error",
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { error, value } = updateUserSchema.validate(req.body);
      if (error) {
        logger.warn({ error }, "Invalid update user input");
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      const { id } = value.user;
      if (id !== req.user.id) {
        logger.warn(`Unauthorized update attempt by user ${req.user.id} for user ${id}`);
        return res.status(403).json({ statusCode: 403, message: "Unauthorized to update this user" });
      }
      logger.info(`Updating user: ${id}`);
      const userUpdated = await userService.updateUserById(id, value.user);
      if (!userUpdated) {
        logger.warn(`User not found: ${id}`);
        return res.status(404).json({ statusCode: 404, message: "User not found" });
      }
      res.status(200).json({
        statusCode: 200,
        user: userUpdated,
      });
    } catch (error) {
      logger.error("Error updating user:", {
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({
        statusCode: 500,
        message: error.message || "Internal server error",
      });
    }
  },
};