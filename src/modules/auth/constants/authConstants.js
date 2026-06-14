// Routes used by the auth module
export const AUTH_ROUTES = {
  LOGIN:           '/login',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP:      '/verify-otp',
  RESET_PASSWORD:  '/reset-password',
  DASHBOARD:       '/dashboard',
  STUDENT_DASHBOARD: '/student-dashboard',
  PROF_DASHBOARD:  '/prof-dashboard',
};

// OTP configuration
export const OTP_LENGTH         = 6;
export const OTP_RESEND_SECONDS = 60;

// Left-panel copy per page (matching Figma illustrations copy exactly)
export const AUTH_PAGE_COPY = {
  login: {
    title:       'Smart Learning Awaits',
    description: 'Join a global community of students and educators redefining the future of digital education.',
  },
  forgotPassword: {
    title:       'Recover Your Account Securely',
    description: 'Enter your email address and we will send you a secure verification code to reset your password.',
  },
  verifyOtp: {
    title:       'Verify Your Identity',
    description: 'We have sent a 6-digit verification code to your email. Enter it below to continue.',
  },
  resetPassword: {
    title:       'Set a Strong New Password',
    description: 'Choose a secure password that is at least 8 characters and includes a number and uppercase letter.',
  },
};

// Role definition constants for registration
export const AUTH_ROLES = [
  { value: 'Student',          label: 'Student',          id: 'Student' },
  { value: 'Doctor',           label: 'Doctor',           id: 'Doctor' },
  { value: 'Teacher Assistant', label: 'Teacher Assistant', id: 'Teacher Assistant' }
];
