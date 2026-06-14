/**
 * formatters.js — Pure formatting utilities used across all modules.
 * No side effects, no state — just transform input → output string.
 */

/**
 * Format a number with locale-aware thousands separators.
 * @param {number} value
 * @param {string} locale - defaults to 'en-US'
 */
export const formatNumber = (value, locale = 'en-US') =>
  new Intl.NumberFormat(locale).format(value);

/**
 * Format a number as currency.
 * @param {number} value
 * @param {string} currency - ISO 4217 code, e.g. 'USD'
 */
export const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

/**
 * Format a Date or ISO string into a readable date.
 * @param {Date|string} date
 * @param {Intl.DateTimeFormatOptions} options
 */
export const formatDate = (date, options = { year: 'numeric', month: 'short', day: 'numeric' }) =>
  new Intl.DateTimeFormat('en-US', options).format(new Date(date));

/**
 * Truncate a string to maxLength characters, appending '…' if trimmed.
 * @param {string} str
 * @param {number} maxLength
 */
export const truncate = (str, maxLength = 40) =>
  str?.length > maxLength ? `${str.slice(0, maxLength)}…` : str;

/**
 * Convert a camelCase or snake_case string to Title Case.
 * @param {string} str
 */
export const toTitleCase = (str) =>
  str
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
