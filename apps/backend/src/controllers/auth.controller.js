import bcrypt from "bcryptjs";

import { createUser, findUserByEmail } from "../models/user.models.js";
import { createToken } from "../utils/auth.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Password is not correct" });
        }

        // generate jwt token
        const token = createToken(user);

        res.json({
            token,
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await createUser({
            email,
            password: hashedPassword,
            display_name: email,
            username: email,
            gender: "male",
            preferred_gender: "female",
        });

        // Return user data (excluding password) and token
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
