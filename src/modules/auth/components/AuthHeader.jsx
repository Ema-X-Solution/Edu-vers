import React from 'react';

/**
 * AuthHeader — the title + subtitle block at the top of every auth form.
 * Optionally renders a back link.
 */
const AuthHeader = ({ title, subtitle, backLink }) => (
  <div className="mb-8">
    {backLink && (
      <div className="mb-5">{backLink}</div>
    )}
    <h1 className="text-2xl font-bold text-dark-blue mb-2 leading-tight">{title}</h1>
    {subtitle && (
      <p className="text-gray-text text-sm leading-relaxed">{subtitle}</p>
    )}
  </div>
);

export default AuthHeader;
