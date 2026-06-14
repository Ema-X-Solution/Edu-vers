import React, { useEffect } from 'react';
import useOTP from '../hooks/useOTP';
import { OTP_LENGTH } from '../constants/authConstants';

/**
 * OTPInput — 6 individual digit boxes with:
 *   - Auto-focus on mount (box 0)
 *   - Auto-advance to next box on digit entry
 *   - Backspace to clear + move back
 *   - Full paste support
 *   - Error styling per-box
 *
 * Controlled: the parent only receives the complete OTP string via `onChange`.
 * All internal logic lives in useOTP.
 */
const OTPInput = ({ onChange, error, autoFocus = true }) => {
  const { digits, inputRefs, handleChange, handleKeyDown, handlePaste } = useOTP(onChange);

  // Auto-focus the first box on mount
  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
  }, [autoFocus, inputRefs]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 justify-center">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            aria-label={`OTP digit ${index + 1}`}
            className={`
              w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none
              transition-all duration-200 bg-[#F8FAFC] text-dark-blue
              caret-main
              ${digit ? 'border-main bg-[#193CE608] scale-105' : 'border-[#E2E8F0]'}
              ${error ? 'border-red-400 bg-red-50/30' : ''}
              focus:border-main focus:bg-white focus:shadow-[0_0_0_3px_#193CE615]
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 text-center mt-1">{error}</p>
      )}
    </div>
  );
};

export default OTPInput;
