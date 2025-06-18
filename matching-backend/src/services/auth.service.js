import bcrypt from "bcryptjs";
import { createToken } from "../utils/auth.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { emailService } from "./email.service.js";
import { userService } from "../services/user.service.js";
import Redis from "ioredis";
import logger from "../utils/logger.js";

const SALT_ROUNDS = 10;
const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
});
const OTP_EXPIRY_SECONDS = 5 * 60;
const TEMP_REGISTRATION_EXPIRY_SECONDS = 15 * 60; // 15 phút

export const authService = {
    loginUser: async (email, password) => {
        const user = await userService.getProfileByEmail(email);
        if (!user) throw new Error("User not found");

        //console.log("User data before login:", { id: user.id, email: user.email }); // Debug
        if (!user.password) {
            logger.error(`No password found for user ${email}`);
            throw new Error("User password is missing");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Password is not correct");

        const token = createToken(user);
        return { token, user };
    },
    async storeTempRegistration(email, password) {
    try {
      const existingUser = await userService.getProfileByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
      const redisKey = `temp_registration:${email}`;
      const data = { email, password };
      await redisClient.setex(redisKey, TEMP_REGISTRATION_EXPIRY_SECONDS, JSON.stringify(data));
      logger.info(`Stored temp registration for ${email}`);
    } catch (error) {
      logger.error({ error, stack: error.stack }, `Error storing temp registration for ${email}`);
      throw error;
    }
  },
    // registerUserNew: async (email, password) => {
    //     const existingUser = await userService.getProfileByEmail(email);
    //     if (existingUser) throw new Error("Email already registered");
    //     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    //     const newUserInput = {
    //         email,
    //         password: hashedPassword,
    //         display_name: email,
    //         username: email,
    //         gender: "male",
    //         preferred_gender: "female",
    //     };
    //     const newUserRaw = await userService.createUser(newUserInput);
    //     const returnedUserInfo = {
    //         id: newUserRaw.id,
    //         displayName: newUserRaw.display_name,
    //         email: newUserRaw.email,
    //         username: newUserRaw.username,
    //     };

    //     return returnedUserInfo;
    // },
    async sendOtpForVerification(email) {
    const otp = generateOTP();
    try {
      const redisKey = `otp:${email}`;
      await redisClient.setex(redisKey, OTP_EXPIRY_SECONDS, otp);
      await emailService.sendVerificationOtp(email, otp);
      logger.info(`OTP for ${email} stored and sent`);
      return true;
    } catch (error) {
      logger.error({ error, stack: error.stack }, `Error sending OTP for ${email}`);
      throw new Error('Không thể gửi mã xác thực.');
    }
  },
    async verifyEmailOtp(email, otp) {
    try {
      const redisKey = `otp:${email}`;
      const storedOtp = await redisClient.get(redisKey);
      if (!storedOtp) {
        throw new Error('Mã OTP đã hết hạn hoặc không tồn tại.');
      }
      if (storedOtp !== otp) {
        throw new Error('Mã OTP không chính xác.');
      }

      // Lấy thông tin đăng ký tạm thời
      const tempRegKey = `temp_registration:${email}`;
      const tempData = await redisClient.get(tempRegKey);
      if (!tempData) {
        throw new Error('Thông tin đăng ký tạm thời đã hết hạn.');
      }
      const { email: storedEmail, password } = JSON.parse(tempData);

      // Tạo user mới
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const newUserInput = {
        email: storedEmail,
        password: hashedPassword,
        username: storedEmail,
        gender: 'male', // Giá trị mặc định
        preferred_gender: 'female', // Giá trị mặc định
      };
      const newUser = await userService.createUser(newUserInput);
      await userService.updateUserEmailVerifiedStatus(newUser.id, true);

      // Xóa dữ liệu tạm thời
      await redisClient.del(redisKey);
      await redisClient.del(tempRegKey);

      logger.info(`Email ${email} verified and user created successfully`);
      return { success: true, user: newUser };
    } catch (error) {
      logger.error({ error, stack: error.stack }, `Error verifying OTP for ${email}`);
      throw error;
    }
  },
};