import React from 'react';

const Card = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E8F0] overflow-hidden ${
        noPadding ? '' : 'p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
