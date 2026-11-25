// client/src/App.jsx
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ErrorMessage from './components/ErrorMessage';
import { useStreamingChat } from './hooks/useStreamingChat';
import { useAutoScroll } from './hooks/useAutoScroll';

function App() {
  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
    retry,
  } = useStreamingChat();

  const { containerRef, handleScroll } = useAutoScroll(messages);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">AI Assistant</h1>
              <p className="text-xs text-gray-500">
                {isStreaming ? 'Generating...' : 'Ready'}
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5
                         rounded-lg hover:bg-gray-100 transition-colors"
            >
              New chat
            </button>
          )}
        </div>
      </header>

      {/* Messages area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">
                  AI
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Ask me anything -- from coding questions to explaining
                concepts. I can help with JavaScript, Python, databases,
                deployment, and more.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[
                  'Explain how M-Pesa API works',
                  'Write a React component for a login form',
                  'How do I deploy to Railway?',
                  'Debug my Express middleware',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-sm px-4 py-2 bg-white border border-gray-200
                               rounded-xl text-gray-700 hover:bg-gray-50
                               hover:border-gray-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isStreaming={
                isStreaming &&
                msg.role === 'assistant' &&
                i === messages.length - 1
              }
            />
          ))}

          {/* Error display */}
          {error && <ErrorMessage error={error} onRetry={retry} />}
        </div>
      </div>

      {/* Input area */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </div>
  );
}

export default App;