/**
 * Students service — thin API layer.
 * Interacts with the real backend endpoints.
 */

import httpClient from '@/shared/services/httpClient';

/**
 * Fetch a paginated + filtered slice of students.
 * @param {{ search?: string, status?: string, page?: number, pageSize?: number }} params
 * @returns {Promise<{ data: object[], total: number }>}
 */
export const fetchStudents = async ({ search = '', status = '', page = 1, pageSize = 5 } = {}) => {
  if (search) {
    const query = new URLSearchParams({ q: search, page, limit: pageSize });
    if (status) query.append('status', status);
    const response = await httpClient.get(`/users/search-students?${query.toString()}`);
    if (Array.isArray(response)) return { data: response, total: response.length };
    return {
      data: response.data || response.users || response,
      total: response.total || response.count || (response.data?.length ?? 0)
    };
  }

  const query = new URLSearchParams({
    role: 'Student',
    page,
    limit: pageSize
  });

  if (status) query.append('status', status);

  const response = await httpClient.get(`/users?${query.toString()}`);
  
  // The exact structure of `response` depends on the backend.
  // We assume the backend returns `{ data: [...], total: ... }` or similar.
  // If the backend returns just an array, we map it:
  if (Array.isArray(response)) {
    return { data: response, total: response.length }; // Fallback if no total is provided
  }

  // Assuming standard pagination response with users inside a property like `users` or `data`
  return {
    data: response.data || response.users || response,
    total: response.total || response.count || (response.data?.length ?? 0)
  };
};

/**
 * Delete a student by ID.
 * @param {string} id
 */
export const deleteStudent = async (id) => {
  return await httpClient.delete(`/users/${id}`);
};

/**
 * Update a student by ID.
 * @param {string} id
 * @param {object} payload
 */
export const updateStudent = async (id, payload) => {
  return await httpClient.patch(`/users/${id}`, payload);
};
