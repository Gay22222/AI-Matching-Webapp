import { metadataService } from "../services/metadata.service.js";
import logger from "../utils/logger.js";

export const metadataController = {
    get: async (req, res) => {
        try {
            const metadata = await metadataService.get();
            logger.info("Metadata retrieved:", Object.keys(metadata));
            res.status(200).json({
                statusCode: 200,
                message: "Metadata retrieved successfully",
                metadata,
            });
        } catch (error) {
            logger.error("Error getting metadata:", {
                message: error.message,
                stack: error.stack,
            });
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
};