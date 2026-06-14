import React from 'react';
import Loader from '../Loader/Loader';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  loading = false,
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-main hover:bg-main-hover text-white',
    outline: 'border border-[#E2E8F0] bg-white text-dark-blue hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-text hover:bg-gray-100 hover:text-dark-blue',
  };
  
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  };
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader size="sm" color="current" />}
      {children}
    </button>
  );
};

export default Button;
