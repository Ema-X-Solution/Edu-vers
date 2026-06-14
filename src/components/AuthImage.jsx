import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

const AuthImage = ({ src, fallback, alt = '', className = '' }) => {
  const [failed, setFailed] = useState(false);
  const currentSrc = failed ? fallback : src;

  if (!currentSrc) {
    return (
      <div className={`flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-[#E2E8F0] text-gray-text ${className}`}>
        <ImageIcon size={40} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl max-h-[350px] ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        className="w-full h-auto object-cover rounded-2xl"
        onError={() => {
          if (!failed && fallback && src !== fallback) {
            setFailed(true);
          }
        }}
      />
    </div>
  );
};

export default AuthImage;
