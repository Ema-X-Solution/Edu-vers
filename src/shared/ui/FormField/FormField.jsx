import React from 'react';

const FormField = ({ label, htmlFor, error, children, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-dark-blue">
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default FormField;
