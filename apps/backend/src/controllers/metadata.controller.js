import { metadataService } from "../services/metadata.service.js";

export const metadataController = {
    get: async (req, res) => {
        try {
            const metadata = await metadataService.get();
            res.status(200).json({
                statusCode: 200,
                message: "Metadata retrieved successfully",
                metadata,
            });
        } catch (error) {
            console.error("Error getting metadata:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
};
