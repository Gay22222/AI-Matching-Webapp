const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TEXT_DIR = path.join(__dirname, '..', '..', 'user_text');
const EMBED_DIR = path.join(__dirname, '..', '..', 'user_embed');

async function embedUserTexts() {
  if (!fs.existsSync(EMBED_DIR)) {
    fs.mkdirSync(EMBED_DIR);
  }

  const files = fs.readdirSync(TEXT_DIR).filter(f => f.endsWith('.txt'));

  for (const file of files) {
    const text = fs.readFileSync(path.join(TEXT_DIR, file), 'utf8');
    const userId = file.match(/\d+/)?.[0];

    if (!userId || !text) continue;

    try {
      const response = await axios.post('http://localhost:3002/ai/embed', {
        texts: [text.trim()]
      });

      const vector = response.data.vectors?.[0];

      if (!vector) throw new Error('No vector returned');

      const outputPath = path.join(EMBED_DIR, `user_${userId}.json`);
      fs.writeFileSync(outputPath, JSON.stringify({ id: userId, embedding: vector }, null, 2), 'utf8');

      console.log(`✅ Embedded and saved: user_${userId}.json`);
    } catch (err) {
      console.error(`❌ Error embedding ${file}: ${err.message}`);
    }
  }
}

embedUserTexts();
