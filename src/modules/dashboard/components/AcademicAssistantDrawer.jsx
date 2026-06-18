import React, { useState, useRef, useEffect } from 'react';
import { Bot, Paperclip, Send, Triangle, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

const AcademicAssistantDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickActions = [
    'SUMMARIES PDF',
    'ESSAY QUESTIONS',
    'GENERATE QUIZ',
    'QUICK INTERACTIVE QUIZ'
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg = { id: Date.now(), text: inputValue, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: 'I am your academic assistant. How can I help you further with this?', 
        sender: 'bot',
        type: 'text'
      }]);
    }, 2500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input
    e.target.value = null;

    const isImage = file.type.startsWith('image/');
    const fileId = Date.now();

    // Add uploading message
    const newMsg = { 
      id: fileId, 
      fileName: file.name, 
      sender: 'user', 
      type: isImage ? 'image' : 'file',
      status: 'uploading'
    };
    
    setMessages(prev => [...prev, newMsg]);

    // Simulate upload progress
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === fileId ? { ...msg, status: 'done' } : msg
      ));
      setIsTyping(true);

      // Mock bot reply to file
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          text: `I received your ${isImage ? 'image' : 'document'} "${file.name}". What would you like me to do with it?`, 
          sender: 'bot',
          type: 'text'
        }]);
      }, 2000);
    }, 2500);
  };

  const renderMessageContent = (msg) => {
    if (msg.type === 'text') {
      return <span>{msg.text}</span>;
    }

    return (
      <div className="flex items-center gap-3 bg-white/20 p-2 rounded-lg">
        <div className="w-10 h-10 rounded bg-white flex items-center justify-center shrink-0">
          {msg.type === 'image' ? <ImageIcon size={20} className="text-teal-500" /> : <FileText size={20} className="text-teal-500" />}
        </div>
        <div className="flex flex-col flex-1 min-w-[120px]">
          <span className="text-sm font-bold truncate max-w-[150px]">{msg.fileName}</span>
          {msg.status === 'uploading' ? (
            <div className="flex items-center gap-1.5 mt-1">
              <Loader2 size={12} className="animate-spin" />
              <span className="text-[10px] opacity-80 uppercase tracking-wider">Uploading...</span>
            </div>
          ) : (
            <span className="text-[10px] opacity-80 uppercase tracking-wider">Ready</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Drawer */}
      <div className="relative w-[400px] max-w-full h-full shadow-2xl flex flex-col p-4 animate-slide-left pointer-events-auto">
        <div className="bg-white rounded-3xl flex-1 flex flex-col overflow-hidden relative border border-gray-100 shadow-lg">
          
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <h2 className="font-extrabold text-sm text-slate-700 tracking-wide">ACADEMIC ASSISTANT</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">&times;</button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
            
            {messages.length === 0 && (
              <div className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2 inline-flex">
                  <Triangle size={12} className="text-teal-600 fill-teal-600" />
                  <h3 className="text-sm font-bold text-slate-800">QUICK ACTIONS</h3>
                </div>
                
                <div className="flex flex-col gap-3">
                  {quickActions.map((action, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setInputValue(action)} 
                      className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <Triangle size={12} className="text-teal-600 fill-teal-600 rotate-90 shrink-0" />
                      <span className="text-sm font-bold text-slate-600">{action}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 mr-2 mt-1">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm break-words ${
                  msg.sender === 'user' 
                    ? 'bg-teal-500 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-slate-700 rounded-tl-none'
                } ${msg.status === 'uploading' ? 'animate-pulse opacity-90' : ''}`}>
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center gap-2 text-slate-400 mt-2">
                <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 mr-1 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-50">
            <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                accept="image/*,.pdf" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                <Paperclip size={20} />
              </button>
              
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="START TYPING....." 
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-600 placeholder:text-slate-300"
              />
              
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  inputValue.trim() ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-teal-50 text-teal-600'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AcademicAssistantDrawer;
