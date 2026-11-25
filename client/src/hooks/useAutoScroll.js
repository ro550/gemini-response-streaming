// client/src/hooks/useAutoScroll.js
import { useRef, useEffect, useCallback } from 'react';

export function useAutoScroll(dependency) {
  const containerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  // Check if user is near the bottom (within 100px)
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // If user is within 100px of the bottom, enable auto-scroll
    // If they have scrolled up, disable it
    shouldAutoScroll.current = distanceFromBottom < 100;
  }, []);

  // Scroll to bottom when dependency changes (new tokens arrive)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !shouldAutoScroll.current) return;

    container.scrollTop = container.scrollHeight;
  }, [dependency]);

  return { containerRef, handleScroll };
}