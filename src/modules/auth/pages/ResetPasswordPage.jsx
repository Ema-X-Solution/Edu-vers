import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import FormActions, { PasswordStrengthBar } from '../components/FormActions';
import PasswordField from '../components/PasswordField';
import { FormField } from '@/shared/ui';
import { resetPasswordSchema } from '../validations/resetPasswordSchema';
import { resetPassword } from '../services/authService';
import { AUTH_ROUTES, AUTH_PAGE_COPY } from '../constants/authConstants';

// import illustration from '@/assets/reset-password-illustration.png';
const illustration = null;

const ResetPasswordPage = () => {
  const navigate                    = useNavigate();
  const location                    = useLocation();
  const email                       = location.state?.email ?? '';
  const otp                         = location.state?.otp ?? '';
  const [isLoading, setLoading]     = useState(false);
  const [serverError, setError]     = useState(null);
  const [success, setSuccess]       = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const watchedPassword = watch('password', '');

  const onSubmit = async ({ password }) => {
    setError(null);
    setLoading(true);
    try {
      // 6. Reset Password flow: auth/reset-password
      // Body payload structure: { email, otp, newPassword }
      await resetPassword({ email, otp, newPassword: password });
      setSuccess(true);
      // Auto-redirect to login after 2.5 seconds
      setTimeout(() => navigate(AUTH_ROUTES.LOGIN), 2500);
    } catch (err) {
      setError(err.message ?? 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        image={illustration}
        title={AUTH_PAGE_COPY.resetPassword.title}
        description={AUTH_PAGE_COPY.resetPassword.description}
      >
        <div className="flex flex-col items-center text-center gap-5 py-8">
          <div className="w-20 h-20 rounded-full bg-percentage-up/10 flex items-center justify-center animate-slide-up">
            <CheckCircle className="text-percentage-up" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-blue mb-2">Password Reset! 🎉</h2>
            <p className="text-gray-text text-sm">
              Your password has been updated successfully. Redirecting you to login…
            </p>
          </div>
          <Link to={AUTH_ROUTES.LOGIN} className="text-main font-semibold text-sm hover:underline">
            Go to Login now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      image={illustration}
      title={AUTH_PAGE_COPY.resetPassword.title}
      description={AUTH_PAGE_COPY.resetPassword.description}
    >
      <AuthHeader
        title="Set New Password"
        subtitle="Choose a strong password you haven't used before."
        backLink={
          <Link
            to={AUTH_ROUTES.VERIFY_OTP}
            className="inline-flex items-center gap-1.5 text-sm text-gray-text hover:text-main transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        }
      />

      {serverError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* New password */}
        <FormField label="New Password" htmlFor="new-password" error={errors.password?.message}>
          <PasswordField
            id="new-password"
            placeholder="Create a strong password"
            error={!!errors.password}
            {...register('password')}
          />
          <PasswordStrengthBar password={watchedPassword} />
        </FormField>

        {/* Confirm password */}
        <FormField label="Confirm Password" htmlFor="confirm-password" error={errors.confirmPassword?.message}>
          <PasswordField
            id="confirm-password"
            placeholder="Re-enter your password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <FormActions
          submitLabel="Reset Password"
          isLoading={isLoading}
        />
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
