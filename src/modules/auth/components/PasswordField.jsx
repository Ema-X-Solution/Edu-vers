import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

/**
 * PasswordField — an Input with a show/hide eye toggle.
 * Built with forwardRef for seamless React Hook Form integration.
 *
 * Props: same as a normal <input> + optional `error` string.
 */
const PasswordField = forwardRef(({ id, placeholder = '••••••••', error, className = '', ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      {/* Lock icon — left */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none flex items-center">
        <Lock size={18} />
      </div>

      <input
        id={id}
        ref={ref}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className={`
          w-full h-11 pl-10 pr-11 py-2 bg-[#F8FAFC] border rounded-lg outline-none transition-colors
          text-dark-text placeholder:text-gray-light text-sm
          focus:border-main focus:bg-white
          ${error ? 'border-red-400 focus:border-red-400 bg-red-50/30' : 'border-[#E2E8F0]'}
          ${className}
        `}
        {...props}
      />

      {/* Eye toggle — right */}
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-blue transition-colors cursor-pointer p-0.5"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordField.displayName = 'PasswordField';
export default PasswordField;
