/**
 * Courses service — API layer for the Courses module.
 */

import httpClient from '@/shared/services/httpClient';

/**
 * Fetch a paginated + filtered list of courses.
 * @param {{ search?: string, year?: string, page?: number, limit?: number }} params
 * @returns {Promise<{ data: object[], meta: object }>}
 */
export const fetchCourses = async ({ search = '', year = '', page = 1, limit = 10 } = {}) => {
  const query = new URLSearchParams({ page, limit });

  if (search) query.append('search', search);
  if (year) query.append('year', year);

  return await httpClient.get(`/courses?${query.toString()}`);
};

/**
 * Fetch course details by ID.
 * @param {string} id
 */
export const fetchCourseById = async (id) => {
  return await httpClient.get(`/courses/${id}`);
};

/**
 * Create a new course.
 * @param {object} payload
 */
export const createCourse = async (payload) => {
  return await httpClient.post('/courses/create', payload);
};

/**
 * Update an existing course.
 * @param {string} id
 * @param {object} payload
 */
export const updateCourse = async (id, payload) => {
  return await httpClient.patch(`/courses/${id}`, payload);
};

/**
 * Delete a course by ID.
 * @param {string} id
 */
export const deleteCourse = async (id) => {
  return await httpClient.delete(`/courses/${id}`);
};
