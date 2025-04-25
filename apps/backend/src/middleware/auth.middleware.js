import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/user.models.js";

// authentication
export const authenticationMiddleware = async (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;

        if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
            return res.status(401).json({
                statusCode: 401,
                message: "Authentication required",
            });
        }

        const token = authHeaders.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await findUserByEmail(decoded.email);

        console.log(user);

        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                message: "Authentication required",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            res.status(401).json({
                statusCode: 401,
                message: "Invalid or expired token",
            });
        } else {
            // Lỗi khác (ví dụ: lỗi database khi tìm user)
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error during authentication",
            });
        }
    }
};

//authorization
export const authorizationMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            console.error(
                `Authorization Failed: User ${req.user.id} role '${req.user.role}' required ${requiredRoles}`
            );
            return res.status(403).json({
                statusCode: 403,
                message: "Authorization Error: User's role is missing",
            });
        } else if (!requiredRoles.includes(req.user.role)) {
            console.error(
                `Authorization Failed: User ${req.user.id} role '${userRole}' required ${requiredRoles}`
            );
            return res.status(403).json({
                statusCode: 403,
                message: "Forbidden: Access denied. Insufficient permissions.",
            });
        }
        next();
    };
};

// validate credential
export const validate = (email, password) => {
    if (!email || !password) {
        return {
            status: false,
            message: "Email and password are required",
        };
    }

    if (password.length < 6) {
        return {
            status: false,
            message: "Password must be at least 6 characters long",
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            status: false,
            message: "Please provide a valid email address",
        };
    }

    return {
        status: true,
        message: "Validation successful",
    };
};

export const validateCredentialsMiddleware = (req, res, next) => {
    const { email, password } = req.body;
    const validationResult = validate(email, password);

    if (validationResult.status !== true) {
        return res.status(400).json({
            statusCode: 400,
            message: validationResult.message,
        });
    }

    next();
};
