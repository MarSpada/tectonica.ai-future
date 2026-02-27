const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI client — lazy init (uses 'openai' env var on Railway)
let openai = null;
function getOpenAI() {
  if (openai) return openai;
  const apiKey = process.env.openai || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  openai = new OpenAI({ apiKey });
  return openai;
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Chat API endpoint (streaming) ───
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const client = getOpenAI();
  if (!client) {
    return res.status(500).json({ error: 'OpenAI API key not configured. Set the "openai" environment variable.' });
  }

  try {
    const stream = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      stream: true,
      max_tokens: 1024
    });

    // Set headers for SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const data = JSON.stringify(chunk);
      res.write(`data: ${data}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    console.error('[MI] OpenAI error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'OpenAI request failed' });
    }
  }
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log(`[MI] Movement Intelligence server running on port ${PORT}`);
  if (!getOpenAI()) {
    console.warn('[MI] ⚠️  No OpenAI API key found. Set the "openai" environment variable.');
    console.warn('[MI]    Chat will return errors until the key is configured.');
  }
});
