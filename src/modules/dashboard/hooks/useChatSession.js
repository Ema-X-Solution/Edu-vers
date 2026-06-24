import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'ai_chat_session_id';

export const useChatSession = () => {
  const [sessionId, setSessionIdState] = useState(() => localStorage.getItem(SESSION_KEY));

  const setSessionId = useCallback((newId) => {
    if (newId) {
      localStorage.setItem(SESSION_KEY, newId);
      setSessionIdState(newId);
    } else {
      localStorage.removeItem(SESSION_KEY);
      setSessionIdState(null);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionIdState(null);
  }, []);

  // Listen to cross-tab changes if needed, but primarily used for simple persistence
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === SESSION_KEY) {
        setSessionIdState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { sessionId, setSessionId, clearSession };
};
