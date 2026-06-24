import httpClient from '@/shared/services/httpClient';

export const getStudentDashboardStats = async () => {
  const response = await httpClient.get('/academic-records/dashboard');
  return response.data || response;
};
