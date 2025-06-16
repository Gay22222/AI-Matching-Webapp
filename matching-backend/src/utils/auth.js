import jwt from "jsonwebtoken";
import logger  from "../utils/logger.js"; // Thêm import logger
import { userRepository } from "../repository/user.repository.js";
import { formatUser } from "../utils/user.utils.js";

export const createToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(
        {
            userId: user.id,
            email: user.email || "", // Gán email rỗng nếu undefined
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};

export const extractToken = (authHeaders) => {
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        throw new Error("Authentication required");
    }
    return authHeaders.split(" ")[1];
};

export const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new Error("Invalid token");
        }
        if (error.name === "TokenExpiredError") {
            throw new Error("Token has expired");
        }
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

export const attachUser = async (decoded, req) => {
    try {
        let user;
        if (!decoded.email) {
            logger.warn(`No email in token for userId ${decoded.userId}`);
            user = await userRepository.findUserById(decoded.userId);
        } else {
            user = await userRepository.findUserByEmail(decoded.email.toLowerCase());
        }
        if (!user) {
            throw new Error("User not found");
        }
        const userFormatted = formatUser(user);
        req.user = userFormatted;
    } catch (error) {
        logger.error({ error, stack: error.stack }, "Error attaching user");
        throw error;
    }
};