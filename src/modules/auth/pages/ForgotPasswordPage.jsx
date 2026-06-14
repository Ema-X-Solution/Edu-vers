import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import FormActions from '../components/FormActions';
import { FormField, Input } from '@/shared/ui';
import { forgotPasswordSchema } from '../validations/forgotPasswordSchema';
import { sendPasswordResetOtp } from '../services/authService';
import { AUTH_ROUTES, AUTH_PAGE_COPY } from '../constants/authConstants';

// import illustration from '@/assets/forgot-password-illustration.png';
const illustration = null;

const ForgotPasswordPage = () => {
  const navigate              = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [serverError, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }) => {
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetOtp({ email });
      // Pass the email forward so the OTP page can display it
      navigate(AUTH_ROUTES.VERIFY_OTP, { state: { email } });
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      image={illustration}
      title={AUTH_PAGE_COPY.forgotPassword.title}
      description={AUTH_PAGE_COPY.forgotPassword.description}
    >
      <AuthHeader
        title="Forgot Password? "
        subtitle="No worries! Enter your email and we'll send you a reset code."
        backLink={
          <Link
            to={AUTH_ROUTES.LOGIN}
            className="inline-flex items-center gap-1.5 text-sm text-gray-text hover:text-main transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        }
      />

      {serverError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField label="Email Address" htmlFor="fp-email" error={errors.email?.message}>
          <Input
            id="fp-email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormActions
          submitLabel="Send Reset Code"
          isLoading={isLoading}
          secondarySlot={
            <>Remember your password?{' '}
              <Link to={AUTH_ROUTES.LOGIN} className="text-main font-semibold hover:underline">
                Sign in
              </Link>
            </>
          }
        />
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
