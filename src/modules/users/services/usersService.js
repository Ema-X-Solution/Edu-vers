import httpClient from '@/shared/services/httpClient';

/**
 * Fetch user profile by ID.
 * Endpoint: GET /users/profile/:id
 * @param {string} id
 */
export const fetchUserProfile = async (id) => {
  return await httpClient.get(`/users/profile/${id}`);
};

export const fetchCurrentGrades = async (semester = 'FALL') => {
  return await httpClient.get(`/grades/my-current-grades?semester=${semester}`);
};

export const fetchAcademicRecords = async (studentId) => {
  return await httpClient.get(`/academic-records/courses/${studentId}`);
};
