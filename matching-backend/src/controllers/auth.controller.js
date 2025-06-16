import Joi from 'joi';
import { authService } from '../services/auth.service.js';
import logger from '../utils/logger.js';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const requestVerificationCodeSchema = Joi.object({
  email: Joi.string().email().required()
});

const verifyEmailWithOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

export const authController = {
  async login(req, res) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        logger.warn({ error }, 'Invalid login input');
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      const { email, password } = value;
      logger.info(`Login attempt for email ${email}`);
      const { token, user } = await authService.loginUser(email, password);
      res.status(200).json({ statusCode: 200, token, user });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error logging in');
      if (error.message === 'User not found' || error.message === 'Password is not correct') {
        return res.status(401).json({ statusCode: 401, message: error.message });
      }
      res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
  },
  async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        logger.warn({ error }, 'Invalid register input');
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      const { email, password } = value;
      logger.info(`Register attempt for email ${email}`);
      const userNew = await authService.registerUserNew(email, password);
      res.status(201).json({ statusCode: 201, user_new: userNew });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error registering');
      if (error.message === 'Email already registered') {
        return res.status(409).json({ statusCode: 409, message: error.message });
      }
      res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
  },
  async requestVerificationCode(req, res, next) {
    try {
      const { error, value } = requestVerificationCodeSchema.validate(req.body);
      if (error) {
        logger.warn({ error }, 'Invalid verification code request input');
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      const { email } = value;
      logger.info(`Requesting verification code for email ${email}`);
      await authService.sendOtpForVerification(email);
      res.status(200).json({ statusCode: 200, message: 'Verification code sent successfully' });
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error requesting verification code');
      next(error);
    }
  },
  async verifyEmailWithOtp(req, res, next) {
    try {
      const { error, value } = verifyEmailWithOtpSchema.validate(req.body);
      if (error) {
        logger.warn({ error }, 'Invalid OTP verification input');
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      const { email, otp } = value;
      logger.info(`Verifying OTP for email ${email}`);
      const isVerified = await authService.verifyEmailOtp(email, otp);
      if (isVerified) {
        res.status(200).json({ statusCode: 200, message: 'Email verified successfully' });
      } else {
        res.status(400).json({ statusCode: 400, message: 'OTP verification failed' });
      }
    } catch (error) {
      logger.error({ error, stack: error.stack }, 'Error verifying OTP');
      if (error.message.includes('Mã OTP')) {
        return res.status(400).json({ statusCode: 400, message: error.message });
      }
      next(error);
    }
  }
};