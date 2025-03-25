import {
    findUserByEmail,
    findUsersOnline,
    createUser,
} from "../models/user.models.js";

export const getProfile = async (req, res) => {
    try {
        const user = await findUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            statusCode: 200,
            id: user.id,
            name: user.display_name,
            email: user.email,
        });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

export const getUsersOnline = async (req, res) => {
    try {
        const users = await findUsersOnline();
        res.status(200).json({
            statusCode: 200,
            users,
        });
    } catch (error) {
        console.error("Error getting users online:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
        });
    }
};
