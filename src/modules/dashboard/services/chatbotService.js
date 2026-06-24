// Use a dedicated base URL for the chatbot since it runs on a separate microservice
const CHATBOT_BASE_URL = 'https://web-production-faf88.up.railway.app';

const request = async (endpoint, options = {}) => {
  const url = `${CHATBOT_BASE_URL}${endpoint}`;
  
  const headers = { ...options.headers };
  // Only add Content-Type JSON if not sending FormData
  if (!(options.body instanceof FormData) && options.method && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.detail || 'Chatbot request failed');
  }
  
  return response.json();
};

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await request('/upload_pdf', { method: 'POST', body: formData });
};

export const sendChatMessage = async (sessionId, question, mode = 'auto', level = 'intermediate') => {
  return await request('/chat', { 
    method: 'POST', 
    body: JSON.stringify({ session_id: sessionId, question, mode, level }) 
  });
};

export const getChatHistory = async (sessionId) => {
  return await request(`/chat/history/${sessionId}`, { method: 'GET' });
};

export const getWelcomeMessage = async () => {
  return await request('/welcome', { method: 'GET' });
};

export const deleteChatHistory = async (sessionId) => {
  return await request(`/chat/history/${sessionId}`, { method: 'DELETE' });
};

export const summarizePdf = async (sessionId, language = 'en') => {
  return await request('/summarize', { 
    method: 'POST', 
    body: JSON.stringify({ session_id: sessionId, language }) 
  });
};

export const extractKeypoints = async (sessionId, language = 'en') => {
  return await request('/extract_keypoints', { 
    method: 'POST', 
    body: JSON.stringify({ session_id: sessionId, language }) 
  });
};

export const generateQuestions = async (sessionId, num_questions = 5, question_type = 'mixed', language = 'en') => {
  return await request('/generate_questions', { 
    method: 'POST', 
    body: JSON.stringify({ session_id: sessionId, num_questions, question_type, language }) 
  });
};

export const generateMcq = async (sessionId, num_questions = 5, difficulty = 'mixed') => {
  return await request('/generate_mcq', { 
    method: 'POST', 
    body: JSON.stringify({ session_id: sessionId, num_questions, difficulty }) 
  });
};

export const submitAnswers = async (sessionId, answers) => {
  return await request('/submit_answers', { 
    method: 'POST', 
    body: JSON.stringify({ session_id: sessionId, answers }) 
  });
};
