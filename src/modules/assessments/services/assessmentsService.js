import httpClient from '@/shared/services/httpClient';

/**
 * Fetch student announcements.
 * @returns {Promise<any>}
 */
export const fetchAnnouncements = async () => {
  return await httpClient.get('/assessments/announcements');
};

/**
 * Submit an assessment.
 * @param {string} assessmentId 
 * @param {string} submissionFileUrl 
 */
export const submitAssessment = async (assessmentId, submissionFileUrl) => {
  return await httpClient.post(`/Submissions/submit/${assessmentId}`, {
    submissionFileUrl
  });
};

/**
 * Fetch course assessments/tasks.
 * @param {string} courseId 
 */
export const fetchCourseAssessments = async (courseId) => {
  return await httpClient.get(`/assessments/course/${courseId}`);
};
