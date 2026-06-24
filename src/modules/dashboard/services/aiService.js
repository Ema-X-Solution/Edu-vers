import httpClient from '@/shared/services/httpClient';

export const fetchProfile = async (studentId) => {
  const response = await httpClient.get(`/users/profile/${studentId}`);
  return response?.data || response;
};

export const fetchCurrentGrades = async () => {
  const response = await httpClient.get('/grades/my-current-grades?semester=FALL');
  return response?.data || response;
};

// Use raw fetch for AI endpoints to bypass httpClient BASE_URL prepending
export const predictRisk = async (payload) => {
  const response = await fetch('https://eduverseml-production.up.railway.app/predict/risk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to predict academic risk');
  return response.json();
};

export const classifyGPA = async (payload) => {
  const response = await fetch('https://eduverseml-production.up.railway.app/predict/gba-class', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to classify GPA');
  return response.json();
};

export const recommendTrack = async (payload) => {
  const response = await fetch('https://eduverseml-production.up.railway.app/recommend/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to recommend track');
  return response.json();
};
