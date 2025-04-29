import { getMetadataData } from "../repository/metadata.repository.js";

export const getMetadata = async (req, res) => {
    try {
        const metadata = await getMetadataData();
        if (!metadata) {
            return res.status(404).json({ message: "Data not found" });
        }
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
};
