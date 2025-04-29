import { userService } from "../services/user.service.js";

export const userController = {
    // [GET] /me
    getProfile: async (req, res) => {
        try {
            const user = await userService.getProfileByEmail(req.user.email);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { password, ...userWithoutPassword } = user;
            res.status(200).json({
                statusCode: 200,
                userWithoutPassword,
            });
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
    // [GET] /user/list-match
    getUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsersFormatted();
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
    },
    // [PUT] /update-profile
    updateUser: async (req, res) => {
        try {
            const { id } = req.body.user;
            const userUpdated = await userService.updateUserById(
                id,
                req.body.user
            );

            if (!userUpdated) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({
                statusCode: 200,
                user: userUpdated,
            });
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
    // [GET] /user/:id
    getUserInfo: async (req, res) => {
        try {
            const user = await userService.getProfileById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                statusCode: 200,
                user,
            });
        } catch (error) {
            console.error("Error getting user:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
};
