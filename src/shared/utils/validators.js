/**
 * validators.js — Field-level validation helpers used by Yup schemas
 * and standalone form logic throughout the app.
 */

/** Test whether a value is a valid email address */
export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? '');

/** Test whether a string meets minimum password requirements */
export const isStrongPassword = (value = '') =>
  value.length >= 8 && /[A-Z]/.test(value) && /\d/.test(value);

/** Test whether a value is a non-empty string */
export const isRequired = (value) =>
  value !== null && value !== undefined && String(value).trim().length > 0;

/** Test whether a string matches a phone number pattern (loose) */
export const isValidPhone = (value) =>
  /^[+\d\s\-().]{7,20}$/.test(value ?? '');
