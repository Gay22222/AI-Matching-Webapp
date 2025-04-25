import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/user.models.js";

export const createToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    // generate jwt token
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        }
    );
};

export const extractToken = (authHeaders) => {
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        throw new Error("Missing or invalid Authorization header");
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
    const user = await findUserByEmail(decoded.email);
    if (!user) {
        throw new Error("User not found");
    }
    req.user = user;
};
