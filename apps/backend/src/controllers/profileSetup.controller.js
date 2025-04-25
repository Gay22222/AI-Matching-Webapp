import {
    getProfileSetupData,
    getProfileSetupDataByUserId,
} from "../models/profileSetup.models.js";

export const getProfileSetup = async (req, res) => {
    try {
        const profileSetupData = await getProfileSetupData();
        if (!profileSetupData) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({
            statusCode: 200,
            message: "Profile setup data retrieved successfully",
            data: profileSetupData,
        });
    } catch (error) {
        console.error("Error getting profile setup:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

export const getProfileSetupByUserId = async (req, res) => {
    console.log(req.params.userId);

    try {
        const profileSetupData = await getProfileSetupDataByUserId(
            parseInt(req.params.userId)
        );
        if (!profileSetupData) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({
            statusCode: 200,
            message: "Profile setup data retrieved successfully",
            data: profileSetupData,
        });
    } catch (error) {
        console.error("Error getting profile setup:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};
