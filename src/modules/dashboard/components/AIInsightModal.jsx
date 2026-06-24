import React, { useState, useEffect } from 'react';
import { Bot, X, RefreshCw, AlertCircle } from 'lucide-react';

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
      }
    }, 15); // typing speed
    
    return () => clearInterval(intervalId);
  }, [text]);

  return <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{displayedText}</p>;
};

const AIInsightModal = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon = Bot,
  isLoading,
  error,
  data,
  onRetry,
  successStyle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-lg bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl shadow-2xl overflow-hidden relative transform transition-all"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className={`p-6 border-b border-gray-100 flex items-center gap-4 ${successStyle ? 'bg-green-50/50' : 'bg-blue-50/50'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${successStyle ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            <Icon size={24} className={isLoading ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">AI-Powered Analysis</p>
          </div>
        </div>

        <div className="p-6 min-h-[250px] flex flex-col">
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <Bot className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={24} />
              </div>
              <p className="text-blue-600 font-medium animate-pulse">Analyzing your academic data...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Analysis Failed</h3>
              <p className="text-gray-500 mb-4 max-w-xs">{error}</p>
              {onRetry && (
                <button 
                  onClick={onRetry}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              )}
            </div>
          )}

          {!isLoading && !error && data && (
            <div className="flex-1">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-full">
                <TypewriterText text={data} />
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightModal;
