import express from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/recommendations/generate', aiController.generateRecommendations);
router.get('/recommendations', authenticationMiddleware, aiController.getRecommendations);

export default router;