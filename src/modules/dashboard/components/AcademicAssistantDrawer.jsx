import React, { useState, useRef, useEffect } from 'react';
import { Bot, Paperclip, Send, Loader2, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatSession } from '../hooks/useChatSession';
import { 
  uploadPdf, 
  sendChatMessage, 
  getChatHistory, 
  deleteChatHistory, 
  summarizePdf, 
  extractKeypoints, 
  generateQuestions, 
  generateMcq,
  getWelcomeMessage
} from '../services/chatbotService';

const AcademicAssistantDrawer = ({ isOpen, onClose }) => {
  const { sessionId, setSessionId, clearSession } = useChatSession();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (sessionId) {
        fetchHistory();
      } else {
        fetchWelcome();
      }
    }
  }, [isOpen, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const fetchWelcome = async () => {
    try {
      const res = await getWelcomeMessage();
      const msg = res?.data?.message || res?.data || res?.message || 'Welcome to AI Assistant';
      setMessages([{
         id: 'welcome-msg',
         text: typeof msg === 'string' ? msg : JSON.stringify(msg),
         sender: 'bot'
      }]);
    } catch(err) {
      setMessages([{ id: 'welcome-msg', text: 'Welcome! Please upload a PDF to start.', sender: 'bot' }]);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getChatHistory(sessionId);
      const data = res?.data || res || {};
      const history = data.history || data || [];
      
      if (Array.isArray(history) && history.length > 0) {
         const formattedHistory = history.map((msg, i) => ({
           id: `hist-${i}`,
           text: msg.text || msg.message || msg.content,
           sender: msg.sender || msg.role || (i % 2 === 0 ? 'user' : 'bot')
         }));
         setMessages(formattedHistory);
      } else if (data.pdf_info) {
         setMessages([{
           id: 'history-welcome',
           text: `Document **${data.pdf_info.filename}** (${data.pdf_info.pages} pages) is active! You can now use the Quick Actions below or ask me anything.`,
           sender: 'bot'
         }]);
      } else {
         setMessages([]);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const typeWriterEffect = (text) => {
    const newMsgId = Date.now();
    setMessages(prev => [...prev, { id: newMsgId, text: '', sender: 'bot' }]);
    
    let i = 0;
    const interval = setInterval(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === newMsgId) {
          return { ...msg, text: text.substring(0, i + 5) };
        }
        return msg;
      }));
      i += 5;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 5);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !sessionId) return;

    const text = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await sendChatMessage(sessionId, text);
      const data = res?.data || res;
      const reply = data?.reply || data?.answer || data;

      typeWriterEffect(typeof reply === 'string' ? reply : JSON.stringify(reply, null, 2));
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now(), text: 'Sorry, I encountered an error connecting to the server.', sender: 'bot', isError: true }]);
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (actionType, label) => {
    setIsTyping(true);
    setMessages(prev => [...prev, { id: Date.now(), text: label, sender: 'user' }]);

    try {
      let res;
      switch (actionType) {
        case 'summarize':
          res = await summarizePdf(sessionId);
          break;
        case 'keypoints':
          res = await extractKeypoints(sessionId);
          break;
        case 'questions':
          res = await generateQuestions(sessionId);
          break;
        case 'mcq':
          res = await generateMcq(sessionId);
          break;
      }
      
      const data = res?.data || res;
      // MCQs return a slightly different object sometimes
      const reply = data?.reply || data?.answer || data?.questions || data;
      
      let formattedReply = reply;
      if (typeof reply !== 'string') {
        if (Array.isArray(reply)) {
          formattedReply = reply.map((q, idx) => {
            const optionsText = q.options ? Object.entries(q.options).map(([k, v]) => `- **${k}**: ${v}`).join('\n') : '';
            return `**Q${idx + 1}: ${q.question || q.text}**\n${optionsText}\n*Answer: ${q.answer || 'Not provided'}*\n*Explanation: ${q.explanation || 'Not provided'}*`;
          }).join('\n\n---\n\n');
        } else if (actionType === 'summarize' && reply.sections) {
          let md = '';
          const { main_topics, key_concepts, important_details, exam_questions } = reply.sections;
          if (main_topics) {
            md += '### Main Topics\n' + main_topics.map(t => `- **${t.title}**: ${t.summary}`).join('\n') + '\n\n';
          }
          if (key_concepts) {
            md += '### Key Concepts\n' + key_concepts.map(c => `- **${c.concept}**: ${c.explanation}`).join('\n') + '\n\n';
          }
          if (important_details) {
            md += '### Important Details\n' + important_details.map(d => `- ${d}`).join('\n') + '\n\n';
          }
          if (exam_questions) {
            md += '### Exam Questions\n' + exam_questions.map(q => `- ${q}`).join('\n') + '\n\n';
          }
          formattedReply = md.trim();
        } else if (actionType === 'keypoints' && reply.keypoints) {
          let md = '';
          const { key_concepts, definitions, important_notes } = reply.keypoints;
          if (key_concepts) {
            md += '### Key Concepts\n' + key_concepts.map(c => `- ${c}`).join('\n') + '\n\n';
          }
          if (definitions) {
            md += '### Definitions\n' + definitions.map(d => `- **${d.term}**: ${d.definition}`).join('\n') + '\n\n';
          }
          if (important_notes) {
            md += '### Important Notes\n' + important_notes.map(n => `- ${n}`).join('\n') + '\n\n';
          }
          formattedReply = md.trim();
        } else {
          formattedReply = JSON.stringify(reply, null, 2);
        }
      }

      typeWriterEffect(formattedReply);
    } catch (err) {
      console.error(`Error in ${actionType}:`, err);
      toast.error(`Failed to generate ${label}`);
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = null; // reset
    setIsUploading(true);

    try {
      const res = await uploadPdf(file);
      const data = res?.data || res;
      
      if (data?.session_id) {
        setSessionId(data.session_id);
        setMessages([
          { 
            id: Date.now(), 
            text: `Document "${file.name}" uploaded successfully! You can now use the Quick Actions below or ask me anything.`, 
            sender: 'bot'
          }
        ]);
        toast.success('Document uploaded successfully');
      } else {
        throw new Error('No session ID returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!sessionId) return;
    try {
      await deleteChatHistory(sessionId);
      clearSession();
      setMessages([]);
      toast.success('History cleared and session restarted');
    } catch (err) {
      console.error('Failed to clear history:', err);
      toast.error('Failed to clear history');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end pointer-events-none">
      <div className="relative w-[50vw] max-w-full h-full shadow-2xl flex flex-col p-4 animate-slide-left pointer-events-auto">
        <div className="bg-white rounded-3xl flex-1 flex flex-col overflow-hidden relative border border-gray-100 shadow-lg">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <h2 className="font-extrabold text-sm text-slate-700 tracking-wide">AI ASSISTANT</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleClearHistory} title="Restart Session" className="text-gray-400 hover:text-red-500 transition-colors p-2">
                <Trash2 size={16} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer px-2">&times;</button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-[#F8FAFC]">
            
            {/* Empty State / Upload Prompt */}
            {!sessionId && messages.length <= 1 && (
              <div className="flex flex-col items-center justify-center mt-8 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                  <FileText size={28} className="text-[#2563EB]" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Upload a Document</h3>
                <p className="text-sm text-slate-500 text-center max-w-[250px] mb-6">
                  Start by uploading a PDF to summarize, extract key points, or generate quizzes.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload}
                  accept=".pdf" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 w-full justify-center"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
                  {isUploading ? 'Uploading...' : 'Browse PDF'}
                </button>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} />
                    </div>
                  )}
                  
                  <div className={`p-4 text-sm shadow-sm whitespace-pre-wrap break-words ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 text-white rounded-2xl rounded-tr-sm' 
                      : msg.isError 
                        ? 'bg-red-50 text-red-600 border border-red-100 rounded-2xl rounded-tl-sm'
                        : 'bg-white text-slate-800 border border-gray-100 rounded-2xl rounded-tl-sm prose prose-sm max-w-none'
                  }`}>
                    {msg.sender === 'bot' && !msg.isError ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center gap-3 mt-2">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-3">
            
            {/* Static Quick Actions */}
            {sessionId && (
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                <button disabled={isTyping} onClick={() => handleQuickAction('summarize', 'Summarize Document')} className="shrink-0 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] uppercase tracking-wider font-bold rounded-lg border border-blue-200 transition-colors disabled:opacity-50">
                  Summarize
                </button>
                <button disabled={isTyping} onClick={() => handleQuickAction('keypoints', 'Extract Key Points')} className="shrink-0 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] uppercase tracking-wider font-bold rounded-lg border border-purple-200 transition-colors disabled:opacity-50">
                  Key Points
                </button>
                <button disabled={isTyping} onClick={() => handleQuickAction('questions', 'Generate Questions')} className="shrink-0 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] uppercase tracking-wider font-bold rounded-lg border border-teal-200 transition-colors disabled:opacity-50">
                  Questions
                </button>
                <button disabled={isTyping} onClick={() => handleQuickAction('mcq', 'Generate MCQ')} className="shrink-0 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[11px] uppercase tracking-wider font-bold rounded-lg border border-orange-200 transition-colors disabled:opacity-50">
                  MCQ
                </button>
              </div>
            )}

            <div className="relative flex items-end gap-2 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-[#2563EB]/20 focus-within:border-[#2563EB] transition-all">
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={sessionId ? "Ask something..." : "Upload a PDF first"} 
                disabled={!sessionId || isTyping}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-gray-400 resize-none max-h-32 min-h-[40px] p-2 scrollbar-thin disabled:opacity-50"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || !sessionId}
                className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                  inputValue.trim() && !isTyping && sessionId ? 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-md shadow-blue-500/20' : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send size={16} className={inputValue.trim() && !isTyping && sessionId ? "ml-1" : ""} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AcademicAssistantDrawer;
