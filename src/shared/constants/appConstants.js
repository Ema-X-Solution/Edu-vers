/**
 * App-wide constants.
 * Single source of truth for route paths, avoiding hard-coded strings
 * scattered across components.
 */

export const ROUTES = {
  HOME:       '/',
  LOGIN:      '/login',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP:      '/verify-otp',
  RESET_PASSWORD:  '/reset-password',
  DASHBOARD:  '/dashboard',
  STUDENT_DASHBOARD: '/student-dashboard',
  PROF_DASHBOARD: '/prof-dashboard',
  STUDENTS:   '/dashboard/students',
  STAFF:      '/dashboard/staff',
  COURSES:    '/dashboard/courses',
  STUDENT_COURSES: '/student-courses',
  COURSE_CREATE: '/dashboard/courses/create',
  COURSE_EDIT:   '/dashboard/courses/edit',
  REGISTRATION: '/dashboard/registration',
  GRADES:     '/dashboard/grades',
};

export const APP_NAME = 'EduVerse';

export const PAGE_SIZE_DEFAULT = 5;
