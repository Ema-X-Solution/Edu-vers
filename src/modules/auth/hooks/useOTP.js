/**
 * useOTP — manages the 6-box OTP input state.
 * Handles: typing, backspace, paste, and focus movement.
 */
import { useRef, useState, useCallback } from 'react';
import { OTP_LENGTH } from '../constants/authConstants';

const useOTP = (onChange) => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs            = useRef([]);

  const focusAt = (index) => inputRefs.current[index]?.focus();

  const handleChange = useCallback(
    (index, value) => {
      // Accept only one digit
      const digit = value.replace(/\D/g, '').slice(-1);
      const next  = [...digits];
      next[index] = digit;
      setDigits(next);
      onChange(next.join(''));

      if (digit && index < OTP_LENGTH - 1) focusAt(index + 1);
    },
    [digits, onChange]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace') {
        if (digits[index]) {
          // Clear current box
          const next = [...digits];
          next[index] = '';
          setDigits(next);
          onChange(next.join(''));
        } else if (index > 0) {
          // Move to previous box
          focusAt(index - 1);
        }
      }
    },
    [digits, onChange]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
      const next   = Array(OTP_LENGTH).fill('');
      pasted.split('').forEach((ch, i) => { next[i] = ch; });
      setDigits(next);
      onChange(next.join(''));
      // Focus the last filled box or the next empty one
      const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      focusAt(lastIndex);
    },
    [onChange]
  );

  const reset = useCallback(() => {
    setDigits(Array(OTP_LENGTH).fill(''));
    onChange('');
    focusAt(0);
  }, [onChange]);

  return { digits, inputRefs, handleChange, handleKeyDown, handlePaste, reset };
};

export default useOTP;
