// client/src/components/ChatInput.jsx
import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, onStop, isStreaming, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  }, [input]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Re-focus after streaming completes
  useEffect(() => {
    if (!isStreaming) {
      textareaRef.current?.focus();
    }
  }, [isStreaming]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || disabled) return;

    onSend(trimmed);
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends the message, Shift+Enter creates a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={isStreaming || disabled}
            rows={1}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:bg-gray-50 disabled:text-gray-500
                       placeholder:text-gray-400"
          />
        </div>

        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center
                       rounded-xl bg-red-500 text-white hover:bg-red-600
                       transition-colors"
            title="Stop generating"
          >
            <StopIcon />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center
                       rounded-xl transition-colors
                       disabled:bg-gray-200 disabled:text-gray-400
                       bg-blue-600 text-white hover:bg-blue-700
                       disabled:cursor-not-allowed"
            title="Send message"
          >
            <SendIcon />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}