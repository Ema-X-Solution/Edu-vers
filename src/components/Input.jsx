import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, id, error, icon: Icon, type = 'text', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark-blue">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-text flex items-center justify-center">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          className={`
            w-full h-11 px-4 py-2 bg-[#F8FAFC] border rounded-lg outline-none transition-colors
            text-dark-text placeholder:text-gray-light
            focus:border-main focus:bg-white
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : 'border-[#E2E8F0]'}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
