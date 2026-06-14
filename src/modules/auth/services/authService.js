/**
 * authService.js — All auth-related API calls.
 */
import { httpClient } from '@/shared/services';

/**
 * 1. Log In
 * Endpoint: auth/log-in
 * @param {{ email, password }} payload
 */
export const loginUser = async ({ email, password }) => {
  return await httpClient.post('/auth/log-in', { email, password });
};

/**
 * 2. Create Account (Admin creates users)
 * Endpoint: auth/create-account
 * @param {{ fullName, email, password, phone, gender, dateOfBirth, department, role, academicId?, currentYear? }} payload
 */
export const createAccount = async (payload) => {
  return await httpClient.post('/auth/create-account', payload);
};


/**
 * 3. Email Confirmation (Confirm Email OTP)
 * Endpoint: auth/confirm-email
 * @param {{ email, otp }} payload
 */
export const confirmEmail = async ({ email, otp }) => {
  return await httpClient.post('/auth/confirm-email', { email, otp });
};

/**
 * 4. Resend OTP
 * Endpoint: auth/resend-otp
 * @param {{ email }} payload
 */
export const resendOtp = async ({ email }) => {
  return await httpClient.post('/auth/resend-otp', { email });
};

/**
 * 5. Forgot Password
 * Endpoint: auth/forgot-password
 * @param {{ email }} payload
 */
export const sendPasswordResetOtp = async ({ email }) => {
  return await httpClient.post('/auth/forgot-password', { email });
};

/**
 * 6. Reset Password
 * Endpoint: auth/reset-password
 * @param {{ email, otp, newPassword }} payload
 */
export const resetPassword = async ({ email, otp, newPassword }) => {
  return await httpClient.post('/auth/reset-password', { email, otp, newPassword });
};


