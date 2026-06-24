import httpClient from '@/shared/services/httpClient';

/**
 * Fetch user profile by ID.
 * Endpoint: GET /users/profile/:id
 * @param {string} id
 */
export const fetchUserProfile = async (id) => {
  return await httpClient.get(`/users/profile/${id}`);
};
