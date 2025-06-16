import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import retry from 'async-retry';
import logger from '../utils/logger.js';

dotenv.config({ path: path.resolve('.env') });

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function connectPrisma() {
  await retry(
    async () => {
      await prisma.$connect();
      logger.info('Connected to database');
    },
    { retries: 5, factor: 2, minTimeout: 1000 }
  );
}

export default prisma;