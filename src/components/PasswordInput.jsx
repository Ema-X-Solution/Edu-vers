import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = forwardRef(
  ({ label, id, error, placeholder = '••••••••', className = '', ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-dark-blue">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-text">
            <Lock size={18} />
          </div>
          <input
            id={id}
            ref={ref}
            type={visible ? 'text' : 'password'}
            placeholder={placeholder}
            className={`
              w-full h-11 pl-10 pr-10 py-2 bg-[#F8FAFC] border rounded-lg outline-none transition-colors
              text-dark-text placeholder:text-gray-light
              focus:border-main focus:bg-white
              ${error ? 'border-red-500 focus:border-red-500' : 'border-[#E2E8F0]'}
            `}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-dark-blue"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
