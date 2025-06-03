import fs from 'fs';
import path from 'path';
import url from 'url';
import axios from 'axios';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const TEXT_DIR = path.join(__dirname, '../user_data/text');
const EMBED_DIR = path.join(__dirname, '../user_data/embed');

async function embedUserText(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input: text must be a non-empty string');
    }

    const embedHost = process.env.EMBEDDING_HOST || 'localhost';
    const embedPort = process.env.EMBEDDING_PORT || '8000';
    const embedUrl = `http://${embedHost}:${embedPort}/embed`;

    console.log(`Calling embed server at ${embedUrl} with text length: ${text.length}`);

    const response = await axios.post(embedUrl, {
      texts: [text.trim()],
    }, {
      timeout: 30000, // Timeout 30s để tránh treo
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.HUGGINGFACE_API_TOKEN && {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        }),
      },
    });

    console.log('Embed server response:', JSON.stringify(response.data, null, 2));

    if (!response.data.vectors || !Array.isArray(response.data.vectors) || response.data.vectors.length === 0) {
      throw new Error('Invalid embedding response: vectors is missing or not an array');
    }

    let vector = response.data.vectors[0];
    console.log('Received vector:', vector);

    // Chuyển đổi vector nếu là object { "0": number, "1": number, ... }
    if (vector && typeof vector === 'object' && !Array.isArray(vector)) {
      vector = Object.keys(vector)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(key => Number(vector[key]));
    }

    // Kiểm tra vector sau khi chuyển đổi
    if (!Array.isArray(vector) || vector.length === 0 || !vector.every(num => typeof num === 'number' && !isNaN(num))) {
      throw new Error('Invalid vector format: vector must be a non-empty array of numbers');
    }

    console.log(`Vector validated successfully, length: ${vector.length}`);
    return vector;
  } catch (error) {
    console.error(`❌ Error embedding text: ${error.message}`, error.stack);
    if (error.response) {
      console.error('Embed server error response:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Embedding server is not running or unreachable');
    }
    throw error;
  }
}

async function embedUserTexts(batchSize = 10) {
  try {
    if (!fs.existsSync(EMBED_DIR)) {
      fs.mkdirSync(EMBED_DIR, { recursive: true });
    }

    const files = fs.readdirSync(TEXT_DIR).filter(f => f.endsWith('.txt'));
    console.log(`Found ${files.length} text files to embed`);

    // Xử lý theo batch để tránh quá tải
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} with ${batch.length} files`);

      for (const file of batch) {
        try {
          const text = fs.readFileSync(path.join(TEXT_DIR, file), 'utf8');
          const userId = file.match(/\d+/)?.[0];

          if (!userId || !text) {
            console.warn(`Skipping file ${file}: invalid userId or empty text`);
            continue;
          }

          const vector = await embedUserText(text);
          const outputPath = path.join(EMBED_DIR, `user_${userId}.json`);
          fs.writeFileSync(
            outputPath,
            JSON.stringify({ id: userId, embedding: vector }, null, 2),
            'utf8'
          );
          console.log(`✅ Embedded and saved: user_${userId}.json`);
        } catch (err) {
          console.error(`❌ Error embedding ${file}: ${err.message}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in embedUserTexts:', error.message, error.stack);
  }
}

export default embedUserText;