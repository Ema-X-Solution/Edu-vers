import React from 'react';

/**
 * AuthCard — white centered card wrapping every auth form on the right side.
 * Keeps padding and max-width consistent across all pages.
 */
const AuthCard = ({ children }) => (
  <div className="w-full lg:w-[58%] flex items-center justify-center bg-white p-6 sm:p-10 lg:p-12 overflow-y-auto">
    <div className="w-full max-w-[420px]">
      {children}
    </div>
  </div>
);

export default AuthCard;
