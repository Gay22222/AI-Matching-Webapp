import bcrypt from "bcryptjs";
import { createToken } from "../utils/auth.js";
import { generateOTP } from "../utils/otpGenerator.js"; // Import hàm tạo OTP
import { emailService } from "./email.service.js"; // Import email service
import { userService } from "../services/user.service.js";
import Redis from "ioredis"; // Import Redis client

const SALT_ROUNDS = 10;
const redisClient = new Redis(process.env.REDIS_URL); // Lấy URL từ .env
const OTP_EXPIRY_SECONDS = 5 * 60;

export const authService = {
    loginUser: async (email, password) => {
        const user = await userService.getProfileByEmail(email);
        if (!user) throw new Error("User not found");
        console.log(user);

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log(isValidPassword);

        //if (!isValidPassword) throw new Error("Password is not correct");
        const token = createToken(user);
        return { token, user };
    },
    registerUserNew: async (email, password) => {
        const existingUser = await userService.getProfileByEmail(email);
        if (existingUser) throw new Error("Email already registered");
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUserInput = {
            email,
            password: hashedPassword,
            display_name: email,
            username: email,
            gender: "male",
            preferred_gender: "female",
        };
        const newUserRaw = await userService.createUser(newUserInput);
        const returnedUserInfo = {
            id: newUserRaw.id,
            displayName: newUserRaw.display_name,
            email: newUserRaw.email,
            username: newUserRaw.username,
        };

        return returnedUserInfo;
    },
    sendOtpForVerification: async (email) => {
        const otp = generateOTP();

        try {
            const redisKey = `otp:${email}`;
            await redisClient.set(redisKey, otp, "EX", OTP_EXPIRY_SECONDS);
            await emailService.sendVerificationOtp(email, otp);

            console.log(`OTP for ${email} stored and sent.`);
            return true;
        } catch (error) {
            console.error(`Error sending OTP for ${email}:`, error);
            throw new Error("Không thể gửi mã xác thực.");
        }
    },
    verifyEmailOtp: async (email, otp) => {
        const redisKey = `otp:${email}`;
        const storedOtp = await redisClient.get(redisKey);

        if (!storedOtp) {
            throw new Error("Mã OTP đã hết hạn hoặc không tồn tại.");
        }

        if (storedOtp !== otp) {
            throw new Error("Mã OTP không chính xác.");
        }

        try {
            const user = await userService.getProfileByEmail(email);
            if (user) {
                await userService.updateUserEmailVerifiedStatus(user.id, true);
                await redisClient.del(redisKey);
            }
            console.log(`Email ${email} verified successfully.`);

            return true;
        } catch (error) {
            console.error(`Error verifying OTP for ${email}:`, error);
            throw new Error("Lỗi trong quá trình xác thực OTP.");
        }
    },
};
