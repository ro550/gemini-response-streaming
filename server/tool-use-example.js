// server/tool-use-example.js
const { GoogleGenAI } = require ('@google/genai');
const dotenv = require('dotenv');
const { tools } = require('./tools/definitions.js');
const { toolHandlers } = require('./tools/handlers.js');

dotenv.config();

const MODEL = 'gemini-3.5-flash-lite';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Gemini wraps tool definitions in `functionDeclarations`. Our definitions use
// Anthropic's `input_schema`, which is plain JSON Schema, so we hand it over
// as `parametersJsonSchema`.
const geminiTools = [
  {
    functionDeclarations: tools.map((t) => ({
      name: t.name,
      description: t.description,
      parametersJsonSchema: t.input_schema,
    })),
  },
];

async function chatWithTools(userMessage) {
  console.log(`\nUser: ${userMessage}\n`);
  // Gemini calls the conversation `contents`, and each message holds `parts`.
  const contents = [{ role: 'user', parts: [{ text: userMessage }] }];

  // Step 1: Send message with tool definitions
  let response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: { tools: geminiTools },
  });

  // Step 2: Loop while the AI wants to use tools.
  // Gemini has no `stop_reason === 'tool_use'`; instead `response.functionCalls`
  // is a non-empty array when the model wants to call tools.
  while (response.functionCalls?.length) {
    const functionResponseParts = [];
    for (const call of response.functionCalls) {
      console.log(`Tool call: ${call.name}(${JSON.stringify(call.args)})`);
      const handler = toolHandlers[call.name];
      const result = handler ? handler(call.args) : { error: `Unknown tool: ${call.name}` };
      console.log('Result:', JSON.stringify(result));

      // Gemini wants an object (not a JSON string) and matches results by name/id.
      functionResponseParts.push({
        functionResponse: { id: call.id, name: call.name, response: result },
      });
    }

    // Step 3: Send tool results back to the AI.
    // Push the model's turn back unchanged (role 'model', not 'assistant') so
    // its thought signatures are preserved, then the results as a 'user' turn.
    contents.push(response.candidates[0].content);
    contents.push({ role: 'user', parts: functionResponseParts });

    response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: { tools: geminiTools },
    });
  }

  // Step 4: Extract the final text response
  console.log(`\nAssistant: ${response.text}`);
  return response.text;
}

async function main() {
  await chatWithTools('What is the weather like in Nairobi right now?');
  await chatWithTools('Convert 50,000 KES to USD');
  await chatWithTools('Check my M-Pesa transaction SHJ7Y5KXQR');
}

main();