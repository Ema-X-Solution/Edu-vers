import React, { forwardRef } from 'react';

const Select = forwardRef(({ id, error, options = [], placeholder, className = '', ...props }, ref) => {
  return (
    <select
      id={id}
      ref={ref}
      className={`
        w-full h-11 px-4 py-2 bg-[#F8FAFC] border rounded-lg outline-none transition-colors
        text-dark-text text-sm cursor-pointer
        focus:border-main focus:bg-white
        ${error ? 'border-red-500 focus:border-red-500' : 'border-[#E2E8F0]'}
        ${className}
      `}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;
