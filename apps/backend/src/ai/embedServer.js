import express from 'express';
import { pipeline } from '@xenova/transformers';

const app = express();
app.use(express.json());

console.log('Loading transformer model...');
let model;
try {
  model = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  console.log('Model loaded successfully.');
} catch (error) {
  console.error('Failed to load transformer model:', error);
  process.exit(1);
}

app.post('/embed', async (req, res) => {
  try {
    const { texts } = req.body;
    console.log('Received request with texts:', texts);
    if (!texts || !Array.isArray(texts)) {
      console.error('Invalid request: texts must be an array');
      return res.status(400).json({ error: 'texts must be an array' });
    }
    const embeddings = await Promise.all(
      texts.map(async (text, index) => {
        console.log(`Generating embedding for text ${index + 1}:`, text);
        const output = await model(text, { pooling: 'mean', normalize: true });
        console.log(`Embedding generated for text ${index + 1}:`, output.data);
        const vector = Array.from(output.data);
        // Kiểm tra vector trước khi trả về
        if (!Array.isArray(vector) || !vector.every(num => typeof num === 'number')) {
          throw new Error(`Invalid vector format for text ${index + 1}: must be an array of numbers`);
        }
        return vector;
      })
    );
    console.log('Sending embeddings response:', embeddings);
    res.json({ vectors: embeddings });
  } catch (error) {
    console.error('Error generating embeddings:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Embedding server running on http://localhost:${PORT}`);
});