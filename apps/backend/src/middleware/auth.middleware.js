import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: "Authentication required",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({
            statusCode: 401,
            message: "Invalid or expired token",
        });
    }
};

export const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            statusCode: 400,
            message: "Name, email and password are required",
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            statusCode: 400,
            message: "Password must be at least 6 characters long",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            statusCode: 400,
            message: "Please provide a valid email address",
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            statusCode: 400,
            message: "Email and password are required",
        });
    }

    next();
};
