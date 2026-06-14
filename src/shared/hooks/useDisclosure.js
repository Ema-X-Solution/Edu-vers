/**
 * useDisclosure — manages the open/close state of modals, drawers, and dropdowns.
 * Centralises toggle logic so components never duplicate it.
 *
 * @param {boolean} initialState - Starting state (default false)
 * @returns {{ isOpen, open, close, toggle }}
 */
import { useState, useCallback } from 'react';

const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open   = useCallback(() => setIsOpen(true),  []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
};

export default useDisclosure;
