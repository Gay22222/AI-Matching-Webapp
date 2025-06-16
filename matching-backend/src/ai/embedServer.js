import express from 'express';
import { pipeline } from '@xenova/transformers';
import Redis from 'ioredis';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file từ thư mục gốc
dotenv.config({ path: path.resolve('.env') });

const app = express();
app.use(express.json());

// Cấu hình Redis client với biến môi trường
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  retryStrategy: times => Math.min(times * 100, 3000), // Retry kết nối
});

// Xử lý lỗi Redis
redis.on('error', (err) => {
  logger.error({ error: err.message, stack: err.stack }, 'Redis connection error');
  // Không thoát ứng dụng, cho phép chạy mà không cần Redis
});

// Kiểm tra kết nối Redis
redis.on('connect', () => {
  logger.info('Connected to Redis');
});

let model;
try {
  model = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  logger.info('Model loaded successfully');
} catch (error) {
  logger.error({ error, stack: error.stack }, 'Failed to load transformer model');
  process.exit(1);
}

app.post('/embed', async (req, res) => {
  try {
    const { texts } = req.body;
    if (!texts || !Array.isArray(texts)) {
      logger.warn('Invalid request: texts must be an array');
      return res.status(400).json({ error: 'texts must be an array' });
    }
    const embeddings = await Promise.all(
      texts.map(async (text, index) => {
        const cacheKey = `embed:${text}`;
        try {
          const cached = await redis.get(cacheKey);
          if (cached) {
            logger.debug(`Cache hit for text ${index + 1}`);
            return JSON.parse(cached);
          }
        } catch (err) {
          logger.warn({ error: err.message }, `Redis cache get error for text ${index + 1}`);
        }
        logger.info(`Generating embedding for text ${index + 1}`);
        const output = await model(text, { pooling: 'mean', normalize: true });
        const vector = Array.from(output.data);
        if (!Array.isArray(vector) || !vector.every(num => typeof num === 'number')) {
          throw new Error(`Invalid vector format for text ${index + 1}`);
        }
        try {
          await redis.setex(cacheKey, 86400, JSON.stringify(vector)); // Cache 24h
        } catch (err) {
          logger.warn({ error: err.message }, `Redis cache set error for text ${index + 1}`);
        }
        return vector;
      })
    );
    res.json({ vectors: embeddings });
  } catch (error) {
    logger.error({ error, stack: error.stack }, 'Error generating embeddings');
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.EMBEDDING_PORT || 8000;
app.listen(PORT, () => logger.info(`Embedding server running on http://localhost:${PORT}`));