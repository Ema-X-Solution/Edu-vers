import loginImage from '../assets/login-image.webp';
import signupImage from '../assets/signup.webp';
import forgotPasswordImage from '../assets/reset-email.webp';
import resetPasswordImage from '../assets/reset-password.webp';

/** Auth illustrations (WebP, bundled by Vite) */
export const authImages = {
  login: loginImage,
  signup: signupImage,
  forgotPassword: forgotPasswordImage,
  resetPassword: resetPasswordImage,
};

/** SVG fallbacks if a WebP fails to load */
export const authImageFallbacks = {
  login: '/images/auth/login.svg',
  signup: '/images/auth/signup.svg',
  forgotPassword: '/images/auth/forgot-password.svg',
  resetPassword: '/images/auth/reset-password.svg',
};
