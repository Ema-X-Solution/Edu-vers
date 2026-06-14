/**
 * useDebounce — delays updating a value until the user stops typing.
 * Prevents firing a search/filter API call on every keystroke.
 *
 * @param {any}    value - The value to debounce
 * @param {number} delay - Milliseconds to wait (default 350ms)
 * @returns {any}  The debounced value
 */
import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
