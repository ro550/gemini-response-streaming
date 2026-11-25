// client/src/components/ChatMessage.jsx
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3'
            : 'bg-white border border-gray-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm'
        }`}
      >
        {/* Sender label for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="text-sm font-medium text-gray-500">
              Assistant
            </span>
          </div>
        )}

        {/* Message content */}
        {isUser ? (
          <p className="leading-7 whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            {message.content ? (
              <MarkdownRenderer content={message.content} />
            ) : isStreaming ? (
              <ThinkingIndicator />
            ) : null}

            {/* Streaming cursor */}
            {isStreaming && message.content && <StreamingCursor />}
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}

function StreamingCursor() {
  return (
    <span className="inline-block w-2 h-5 bg-gray-800 ml-0.5 animate-pulse" />
  );
}