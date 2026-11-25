// client/src/hooks/useStreamingChat.js
import { useState, useCallback, useRef, useEffect } from 'react';

export function useStreamingChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const lastUserMessageRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (userMessage) => {
      const userMsg = { role: 'user', content: userMessage };
      lastUserMessageRef.current = userMessage;

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsStreaming(true);
      setError(null);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const aiMessageIndex = updatedMessages.length;
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      try {
        const response = await fetch(
          'http://localhost:3001/api/chat/stream',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: updatedMessages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            }),
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'text') {
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[aiMessageIndex] = {
                      ...updated[aiMessageIndex],
                      content:
                        updated[aiMessageIndex].content + parsed.text,
                    };
                    return updated;
                  });
                } else if (parsed.type === 'error') {
                  setError(parsed.error);
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Stream cancelled');
        } else {
          setError(err.message);
          // Remove empty AI message on error
          setMessages((prev) =>
            prev.filter((_, i) => i !== aiMessageIndex)
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [messages]
  );

  const retry = useCallback(() => {
    if (lastUserMessageRef.current) {
      // Remove the last user message (it will be re-added by sendMessage)
      setMessages((prev) => prev.slice(0, -1));
      setError(null);
      // Use setTimeout to allow state to update before re-sending
      setTimeout(() => {
        sendMessage(lastUserMessageRef.current);
      }, 0);
    }
  }, [sendMessage]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    lastUserMessageRef.current = null;
  }, []);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
    retry,
  };
}