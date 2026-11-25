
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL = 'gemini-3.5-flash-lite';

app.use(cors());
app.use(express.json());

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

function normalizeMessages(messages) {
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.some(
      (message) =>
        !message ||
        !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string'
    )
  ) {
    throw new TypeError('messages must be a non-empty array of user/assistant messages');
  }

  return messages.map(({ role, content }) => ({
    role: role === 'assistant' ? 'model' : 'user',
    parts: [{ text: content }],
  }));
}

// Regular (non-streaming) endpoint for comparison
app.post('/api/chat', async (req, res) => {
  try {
    const contents = normalizeMessages(req.body?.messages);
    const response = await genai.models.generateContent({
      model: MODEL,
      contents,
    });

    res.json({
      content: response.text,
      usage: response.usageMetadata,
    });
  } catch (error) {
    console.error('Chat error:', error);
    const status = error instanceof TypeError ? 400 : 500;
    res.status(status).json({
      error: status === 400 ? error.message : 'Failed to generate response',
    });
  }
});

// Streaming endpoint using SSE
app.post('/api/chat/stream', async (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Prevent response buffering (important for some proxies)
  res.flushHeaders();

  const abortController = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  try {
    const contents = normalizeMessages(req.body?.messages);
    const stream = await genai.models.generateContentStream({
      model: MODEL,
      contents,
      config: { abortSignal: abortController.signal },
    });

    let usage;
    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ type: 'text', text: chunk.text })}\n\n`);
      }
      usage = chunk.usageMetadata ?? usage;
    }

    res.write(`data: ${JSON.stringify({ type: 'done', usage })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Stream setup error:', error);
    if (!res.destroyed) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: error instanceof TypeError ? error.message : 'Failed to start stream',
        })}\n\n`
      );
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});