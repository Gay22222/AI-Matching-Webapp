import { pipeline } from '@xenova/transformers';

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  }
  return embedder;
}

export const embedController = {
  async embed(req, res) {
    try {
      const { texts } = req.body;
      if (!Array.isArray(texts)) {
        return res.status(400).json({ error: 'Missing texts[]' });
      }

      const model = await getEmbedder();
      const results = [];

      for (const text of texts) {
        const tensor = await model(text, { pooling: 'mean', normalize: true });
        results.push(tensor.data);
      }

      return res.status(200).json({ vectors: results });
    } catch (err) {
      console.error('❌ Embedding error:', err);
      res.status(500).json({ error: 'Internal embedding error' });
    }
  }
};
