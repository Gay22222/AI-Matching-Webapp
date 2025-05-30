import { authService } from "../services/auth.service.js";

export const authController = {
    // [POST] /login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const { token, user } = await authService.loginUser(
                email,
                password
            );
            res.status(200).json({
                token,
                user,
                statusCode: 200,
            });
        } catch (error) {
            if (
                error.message === "User not found" ||
                error.message === "Password is not correct"
            ) {
                console.error("Error logging in:", error);
                return res.status(401).json({
                    statusCode: 401,
                    message: error.message,
                });
            }
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // [POST] /register
    register: async (req, res) => {
        try {
            const { email, password } = req.body;
            const userNew = await authService.registerUserNew(email, password);
            res.status(201).json({
                user_new: userNew,
            });
        } catch (error) {
            if (error.message === "Email already registered") {
                console.error("Error logging in:", error);
                return res.status(409).json({
                    statusCode: 409,
                    message: "Email already registered",
                });
                return;
            }
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // [POST] /send-verification-otp
    requestVerificationCode: async (req, res, next) => {
        try {
            const { email } = req.body;
            await authService.sendOtpForVerification(email);
            res.status(200).json({
                statusCode: 200,
                message: "Verification code sent successfully",
            });
        } catch (error) {
            console.error("Error requesting verification code:", error);
            next(error);
        }
    },
    // [POST] /verify-otp
    verifyEmailWithOtp: async (req, res, next) => {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Email and OTP are required",
                });
            }
            const isVerified = await authService.verifyEmailOtp(email, otp);

            if (isVerified) {
                res.status(200).json({
                    statusCode: 200,
                    message: "Email verified successfully",
                });
            } else {
                res.status(400).json({
                    statusCode: 400,
                    message: "OTP verification failed",
                });
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            if (error.message.includes("Mã OTP")) {
                return res
                    .status(400)
                    .json({ statusCode: 400, message: error.message });
            }
            next(error);
        }
    },
};
