import { extractToken, verifyToken, attachUser } from "../utils/auth.js";

// authentication
export const authenticationMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ cookie thay vì header
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Authentication required");
        }
        const decoded = verifyToken(token);
        await attachUser(decoded, req);
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        if (
            error.message === "Authentication required" ||
            error.message === "Invalid or expired token" ||
            error.message === "Token has expired"
        ) {
            return res.status(401).json({
                statusCode: 401,
                message: error.message,
            });
        }
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error during authentication",
        });
    }
};

//authorization
export const authorizationMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            console.error(
                `Authorization Failed: User ${req.user?.id} role '${req.user?.role}' required ${requiredRoles}`
            );
            return res.status(403).json({
                statusCode: 403,
                message: "Authorization Error: User's role is missing",
            });
        } else if (!requiredRoles.includes(req.user.role)) {
            console.error(
                `Authorization Failed: User ${req.user.id} role '${req.user.role}' required ${requiredRoles}`
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
    console.log(email, password);

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
    console.log(email, password);

    const validationResult = validate(email, password);

    if (validationResult.status !== true) {
        console.log("asdasdavk;savksajfskladfjl");

        return res.status(400).json({
            statusCode: 400,
            message: validationResult.message,
        });
    }

    next();
};
