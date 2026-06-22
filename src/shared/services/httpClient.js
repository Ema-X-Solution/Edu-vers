/**
 * httpClient.js — Base HTTP client (Fetch wrapper).
 * All API service files import this instead of calling fetch() directly.
 * This makes it trivially easy to swap in axios, add auth headers,
 * handle token refresh, etc. — in one place.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

/**
 * Core request function.
 * @param {string} endpoint  - Path relative to BASE_URL
 * @param {RequestInit} options - Fetch options (method, body, headers…)
 * @returns {Promise<any>}   - Parsed JSON response
 */
const request = async (endpoint, options = {}) => {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Routes that do NOT require an Authorization header
  const publicRoutes = [
    '/auth/log-in',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/confirm-email',
    '/auth/resend-otp',
    '/auth/signup',
    '/auth/register',
  ];
  const isPublic = publicRoutes.some(route => formattedEndpoint.includes(route));
  const token = isPublic ? null : localStorage.getItem('auth_token');

  // Guard: if the route needs auth but no token is found, redirect to login
  if (!isPublic && !token) {
    localStorage.removeItem('user_info');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Let fetch handle the Content-Type boundary for FormData automatically
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${formattedEndpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Only clear the token on 401 for protected (non-public) routes.
    // Public route 401s (e.g. wrong password, unconfirmed email) should NOT clear the token.
    if (response.status === 401 && !isPublic) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error?.message ?? 'Request failed');
  }

  // 204 No Content → return null
  if (response.status === 204) return null;

  return response.json();
};


const httpClient = {
  get:    (endpoint, options)       => request(endpoint, { ...options, method: 'GET' }),
  post:   (endpoint, body, options) => request(endpoint, { ...options, method: 'POST',  body: body instanceof FormData ? body : JSON.stringify(body) }),
  put:    (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT',   body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch:  (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint, options)       => request(endpoint, { ...options, method: 'DELETE' }),
};

export default httpClient;
