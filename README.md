# Gemini Response Streaming

A full-stack chat application that connects a React interface to Google's Gemini API and streams model responses in real time using Server-Sent Events (SSE).

## Project Overview

The client collects conversation messages and sends them to an Express API. The server forwards the conversation to Gemini with streaming enabled, then forwards each text chunk to the browser as it becomes available. The interface updates the assistant response progressively instead of waiting for the complete result.

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- `react-markdown` and `remark-gfm` for formatted Markdown
- `react-syntax-highlighter` for code blocks
- ESLint

### Backend

- Node.js
- Express 5
- Google Gen AI SDK (`@google/genai`)
- Server-Sent Events (SSE)
- CORS and dotenv

## Features

- Real-time streamed Gemini responses
- Markdown and GitHub-Flavored Markdown rendering
- Syntax-highlighted code blocks
- Conversation context across messages
- Stop streaming and clear chat controls
- Retryable error messages
- Automatic message scrolling
- Suggested prompt chips
- A non-streaming `/api/chat` endpoint for response comparison
- Example terminal streaming and tool-use scripts

## Prerequisites

- Node.js 18 or later
- npm
- A Google AI Studio API key

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/ro550/gemini-response-streaming.git
cd gemini-response-streaming
```

### 2. Configure the server

Create `server/.env`:

```env
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
PORT=3001
```

Replace `your_google_ai_api_key` with a valid API key. Keep this file private; do not commit it to Git.

### 3. Install dependencies

Install the server dependencies:

```bash
cd server
npm install
```

In a separate terminal, install the client dependencies:

```bash
cd client
npm install
```

## Run the Application

Start the backend from the `server` directory:

```bash
npm run dev
```

The server runs at `http://localhost:3001` by default.

Start the frontend from the `client` directory in a second terminal:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## API Endpoints

### Streaming chat

```http
POST /api/chat/stream
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Explain Server-Sent Events" }
  ]
}
```

Returns an SSE stream containing `text`, `done`, and `error` events.

### Non-streaming chat

```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Explain Server-Sent Events" }
  ]
}
```

Returns the complete response and usage metadata as JSON.

## Available Commands

### Client

```bash
cd client
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

### Server

```bash
cd server
npm run dev       # Start the Express server
```

## Project Structure

```text
.
├── client/
│   ├── src/
│   │   ├── components/     # Chat UI components
│   │   ├── hooks/          # Streaming and auto-scroll hooks
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── server/
    ├── server.js           # Express API and SSE endpoints
    ├── text-streaming.js   # Terminal text-streaming example
    ├── tool-use-example.js # Gemini tool-use example
    └── package.json
```

## Security

Never expose the Google AI API key in client-side code or commit `.env` files to source control. The server keeps the key on the backend and serves Gemini responses through the API.