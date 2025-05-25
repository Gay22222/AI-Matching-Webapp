import { matchService } from "../services/match.service.js";

export const matchController = {
    // [GET] /matches/:id
    get: async (req, res) => {
        try {
            const match = req?.match;
            console.log(match);

            res.status(200).json({
                statusCode: 200,
                data: match,
            });
        } catch (error) {
            console.error("Error getting match:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
    // [GET] /matches
    getAll: async (req, res) => {
        try {
            const userId = req.user;

            const matches = await matchService.getAll(userId?.id);
            res.status(200).json({
                statusCode: 200,
                data: matches,
            });
        } catch (error) {
            console.error("Error getting match:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
    // [POST] /matches
    create: async (req, res) => {
        try {
            const { receiverId } = req.body;
            const user = req.user;

            const senderId = user?.id;

            if (!senderId || !receiverId) {
                return res.status(400).json({
                    message: "Missing required fields",
                    statusCode: 400,
                });
            }

            const match = await matchService.create(senderId, receiverId);
            res.status(201).json({
                statusCode: 201,
                message: "Match created successfully",
                match,
            });
        } catch (error) {
            if (error.message === "The match has already been created") {
                return res
                    .status(409)
                    .json({ statusCode: 409, message: error.message });
            } else if (error.message === "Cannot create match") {
                return res
                    .status(500)
                    .json({ statusCode: 500, message: error.message });
            }
            console.error("Error creating match:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
};
