/**
 * useCountdown — counts down from `initialSeconds` to 0.
 * Used by the OTP page to gate the "Resend code" button.
 *
 * @param {number} initialSeconds
 * @returns {{ count, isRunning, start, reset }}
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const useCountdown = (initialSeconds = 60) => {
  const [count,     setCount]     = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef               = useRef(null);

  const clear = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const start = useCallback(() => {
    setCount(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    clear();
    setCount(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clear();
          setIsRunning(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return clear;
  }, [isRunning]);

  return { count, isRunning, start, reset };
};

export default useCountdown;
