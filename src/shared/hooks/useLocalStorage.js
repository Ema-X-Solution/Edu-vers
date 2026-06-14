/**
 * useLocalStorage — persistent useState that syncs with localStorage.
 * Useful for remembering user preferences (theme, sidebar state, etc.).
 *
 * @param {string} key           - The localStorage key
 * @param {any}    defaultValue  - Fallback when the key doesn't exist
 * @returns {[any, Function]}    - [storedValue, setValue]
 */
import { useState } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: error writing key "${key}"`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
