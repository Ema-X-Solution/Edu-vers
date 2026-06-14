// Pages
export { default as LoginPage } from './pages/LoginPage';
export { default as CreateAccountPage } from './pages/CreateAccountPage';
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { default as OTPVerificationPage } from './pages/OTPVerificationPage';
export { default as ResetPasswordPage } from './pages/ResetPasswordPage';

// Layouts & Components
export { default as AuthLayout } from './layouts/AuthLayout';
export { default as AuthIllustrationSection } from './components/AuthIllustrationSection';
export { default as AuthCard } from './components/AuthCard';
export { default as AuthHeader } from './components/AuthHeader';
export { default as OTPInput } from './components/OTPInput';
export { default as PasswordField } from './components/PasswordField';
export { default as FormActions } from './components/FormActions';

// Validation Schemas
export { loginSchema } from './validations/loginSchema';
export { createAccountSchema } from './validations/createAccountSchema';
export { forgotPasswordSchema } from './validations/forgotPasswordSchema';
export { otpSchema } from './validations/otpSchema';
export { resetPasswordSchema } from './validations/resetPasswordSchema';

// Hooks
export { default as useAuth } from './hooks/useAuth';
export { default as useOTP } from './hooks/useOTP';

// Constants
export * from './constants/authConstants';
