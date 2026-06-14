import React, { forwardRef } from 'react';

const Input = forwardRef(({ id, error, icon: Icon, type = 'text', className = '', ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-text flex items-center justify-center pointer-events-none">
          <Icon size={18} />
        </div>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        className={`
          w-full h-11 px-4 py-2 bg-[#F8FAFC] border rounded-lg outline-none transition-colors
          text-dark-text placeholder:text-gray-light text-sm
          focus:border-main focus:bg-white
          ${Icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 focus:border-red-500' : 'border-[#E2E8F0]'}
          ${className}
        `}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
