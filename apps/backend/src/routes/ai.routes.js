import express from 'express';
import { embedController } from '../ai/embedding/embed.controller.js';

const router = express.Router();

router.post('/embed', embedController.embed);

export default router;
