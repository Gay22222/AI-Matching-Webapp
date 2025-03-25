import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import { findUserByEmail, createUser } from "../models/user.models.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // find user
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // generate jwt token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
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
        const { name, email, password } = req.body;

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
            display_name: name,
            username: name,
            gender: "male",
            preferred_gender: "female",
        });

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        // Return user data (excluding password) and token
        res.status(201).json({
            token,
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
