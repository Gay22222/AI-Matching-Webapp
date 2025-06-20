import { extractToken, verifyToken, attachUser } from "../utils/auth.js";

export const authenticationMiddleware = async (req, res, next) => {
    try {
        console.log("Authentication middleware called:", {
            method: req.method,
            path: req.path,
            headers: req.headers.authorization,
        });

        if (!req.headers.authorization) {
            throw new Error("Authentication required: No authorization header provided");
        }

        const token = extractToken(req.headers.authorization);
        console.log("Extracted token:", token.slice(0, 20) + "..."); // Chỉ log 20 ký tự đầu
        const decoded = verifyToken(token);
        console.log("Decoded token:", { userId: decoded.userId, email: decoded.email });

        await attachUser(decoded, req);
        if (!req.user) {
            throw new Error("Invalid or expired token: User not found");
        }
        console.log("Authenticated user:", { userId: req.user.id });

        next();
    } catch (error) {
        console.error("Authentication middleware error:", {
            message: error.message,
            path: req.path,
            stack: error.stack,
        });

        if (
            error.message.includes("Authentication required") ||
            error.message.includes("Invalid or expired token") ||
            error.message.includes("Token has expired")
        ) {
            return res.status(401).json({
                statusCode: 401,
                message: error.message,
            });
        }

        return res.status(400).json({
            statusCode: 400,
            message: "Bad Request: Invalid token format",
        });
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
