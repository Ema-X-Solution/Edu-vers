/**
 * Staff service — API layer for the Staff module.
 */

import httpClient from '@/shared/services/httpClient';

/**
 * Fetch a paginated + filtered slice of staff (Professors).
 * @param {{ search?: string, status?: string, page?: number, pageSize?: number }} params
 * @returns {Promise<{ data: object[], total: number }>}
 */
export const fetchStaff = async ({ search = '', status = '', page = 1, pageSize = 5 } = {}) => {
  const query = new URLSearchParams({
    role: 'Professor',
    page,
    limit: pageSize
  });

  if (search) query.append('search', search);
  if (status) query.append('status', status);

  const response = await httpClient.get(`/users?${query.toString()}`);
  
  if (Array.isArray(response)) {
    return { data: response, total: response.length };
  }

  return {
    data: response.data || response.users || response,
    total: response.total || response.count || (response.data?.length ?? 0)
  };
};

/**
 * Delete a staff member by ID.
 * @param {string} id
 */
export const deleteStaff = async (id) => {
  return await httpClient.delete(`/users/${id}`);
};

/**
 * Update a staff member by ID.
 * @param {string} id
 * @param {object} payload
 */
export const updateStaff = async (id, payload) => {
  return await httpClient.patch(`/auth/user/${id}`, payload);
};
