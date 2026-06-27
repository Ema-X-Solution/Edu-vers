import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#090D16]/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div 
        className={`
          relative bg-white rounded-xl shadow-xl w-full border border-[#E2E8F0] overflow-hidden
          transform transition-all duration-300 scale-95 opacity-0 animate-slide-up
          ${sizes[size]}
        `}
        style={{
          animationFillMode: 'forwards'
        }}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0] bg-gray-50/50">
          <h3 className="text-base font-bold text-dark-blue">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-dark-blue transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
