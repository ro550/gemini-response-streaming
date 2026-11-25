// server/test-stream-gemini.js
const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testStream() {
  const stream = await ai.models.generateContentStream({
    model: 'gemini-3.5-flash-lite',
    contents: 'Explain how M-Pesa works in three paragraphs.',
  });

  let usage = null;

  // The Gemini SDK doesn't emit 'text' events like the Anthropic SDK --
  // instead you async-iterate the stream directly, and each chunk carries
  // a `.text` piece plus a cumulative `.usageMetadata` snapshot.
  for await (const chunk of stream) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    }
    if (chunk.usageMetadata) {
      usage = chunk.usageMetadata; // last one seen is the final tally
    }
  }

  console.log('\n\n--- Stream complete ---');
  console.log('Total tokens used:', usage);
}

testStream();