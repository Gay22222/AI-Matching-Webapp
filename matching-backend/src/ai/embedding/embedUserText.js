import fs from 'fs';
import path from 'path';
import url from 'url';
import axios from 'axios';
import pLimit from 'p-limit';
import logger from '../../utils/logger.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const TEXT_DIR = path.join(__dirname, '../user_data/text');
const EMBED_DIR = path.join(__dirname, '../user_data/embed');
const limit = pLimit(5);

async function embedUserText(text) {
  try {
    if (!text || typeof text !== 'string') {
      logger.warn('Invalid input: text must be a non-empty string');
      throw new Error('Invalid input: text must be a non-empty string');
    }

    const embedHost = process.env.EMBEDDING_HOST || 'embedding';
    const embedPort = process.env.EMBEDDING_PORT || '8000';
    const embedUrl = `http://${embedHost}:${embedPort}/embed`;

    logger.info(`Calling embed server at ${embedUrl}`);
    const response = await axios.post(embedUrl, { texts: [text.trim()] }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.HUGGINGFACE_API_TOKEN && {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`
        })
      }
    });

    if (!response.data.vectors || !Array.isArray(response.data.vectors) || response.data.vectors.length === 0) {
      logger.warn('Invalid embedding response');
      throw new Error('Invalid embedding response');
    }

    let vector = response.data.vectors[0];
    if (vector && typeof vector === 'object' && !Array.isArray(vector)) {
      vector = Object.keys(vector).sort((a, b) => parseInt(a) - parseInt(b)).map(key => Number(vector[key]));
    }

    if (!Array.isArray(vector) || vector.length === 0 || !vector.every(num => typeof num === 'number' && !isNaN(num))) {
      logger.warn('Invalid vector format');
      throw new Error('Invalid vector format');
    }

    logger.debug(`Vector validated, length: ${vector.length}`);
    return vector;
  } catch (error) {
    logger.error({ error, stack: error.stack }, 'Error embedding text');
    throw error;
  }
}

async function embedUserTexts(batchSize = 10) {
  try {
    if (!fs.existsSync(EMBED_DIR)) fs.mkdirSync(EMBED_DIR, { recursive: true });
    const files = fs.readdirSync(TEXT_DIR).filter(f => f.endsWith('.txt'));
    logger.info(`Found ${files.length} text files to embed`);

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      logger.info(`Processing batch ${i / batchSize + 1} with ${batch.length} files`);

      await Promise.all(
        batch.map(file =>
          limit(async () => {
            const text = fs.readFileSync(path.join(TEXT_DIR, file), 'utf8');
            const userId = file.match(/\d+/)?.[0];
            if (!userId || !text) {
              logger.warn(`Skipping file ${file}: invalid userId or empty text`);
              return;
            }
            try {
              const vector = await embedUserText(text);
              const outputPath = path.join(EMBED_DIR, `user_${userId}.json`);
              fs.writeFileSync(outputPath, JSON.stringify({ id: userId, embedding: vector }, null, 2));
              logger.info(`Embedded and saved: user_${userId}.json`);
            } catch (err) {
              logger.error({ err }, `Error embedding ${file}`);
            }
          })
        )
      );
    }
  } catch (error) {
    logger.error({ error, stack: error.stack }, 'Error in embedUserTexts');
  }
}

export default embedUserText;