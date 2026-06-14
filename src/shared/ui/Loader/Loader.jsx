import React from 'react';

const Loader = ({ size = 'md', color = 'main', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    main: 'border-main border-t-transparent',
    white: 'border-white border-t-transparent',
    current: 'border-current border-t-transparent',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          rounded-full animate-spin
          ${sizes[size]}
          ${colors[color]}
        `}
      />
    </div>
  );
};

export default Loader;
