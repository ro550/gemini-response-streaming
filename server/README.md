# Gemini Streaming

A minimal Node.js demo that streams text responses from Google's Gemini API in real time, printing each chunk to the terminal as it arrives along with token usage stats.

## How it works

The script calls `generateContentStream()` from the `@google/genai` SDK and async-iterates over the response chunks. Each chunk carries a `.text` piece that gets written to stdout immediately, giving you a live streaming effect instead of waiting for the full response.

## Prerequisites

- Node.js v18+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

## Run

```bash
node text-streaming.js
```

You'll see the response stream into your terminal word by word, followed by a token usage summary:

```
M-Pesa is a mobile money service...

--- Stream complete ---
Total tokens used: { promptTokenCount: 12, candidatesTokenCount: 58, totalTokenCount: 70 }
```

## Project structure

```
gemini-streaming/
├── text-streaming.js   # main script
├── .env                # API key (not committed)
└── package.json
```
