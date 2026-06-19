import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
  hideCursorAfter?: number;
}

interface UseTypewriterReturn {
  displayText: string;
  showCursor: boolean;
  isComplete: boolean;
  reset: () => void;
}

export function useTypewriter({
  text,
  speed = 50,
  startDelay = 0,
  enabled = true,
  hideCursorAfter = 3000,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    indexRef.current = 0;
    setDisplayText('');
    setIsComplete(false);
    setShowCursor(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    reset();

    const startTimeout = setTimeout(() => {
      const typeChar = () => {
        if (indexRef.current < text.length) {
          setDisplayText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
          timerRef.current = setTimeout(typeChar, speed);
        } else {
          setIsComplete(true);
          if (hideCursorAfter > 0) {
            timerRef.current = setTimeout(() => {
              setShowCursor(false);
            }, hideCursorAfter);
          }
        }
      };
      typeChar();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, startDelay, enabled, hideCursorAfter, reset]);

  return { displayText, showCursor, isComplete, reset };
}
