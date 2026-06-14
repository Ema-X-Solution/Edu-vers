import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import FormActions from '../components/FormActions';
import OTPInput from '../components/OTPInput';
import { confirmEmail, resendOtp } from '../services/authService';
import { otpSchema } from '../validations/otpSchema';
import { useCountdown } from '@/shared/hooks';
import { AUTH_ROUTES, AUTH_PAGE_COPY, OTP_RESEND_SECONDS } from '../constants/authConstants';

// import illustration from '@/assets/otp-illustration.png';
const illustration = null;

const OTPVerificationPage = () => {
  const navigate                    = useNavigate();
  const location                    = useLocation();
  const email                       = location.state?.email ?? '';
  const isConfirmEmail              = location.state?.isConfirmEmail ?? location.state?.isRegistration ?? false;
  const [isLoading, setLoading]     = useState(false);
  const [serverError, setError]     = useState(null);
  const [resendLoading, setResend]  = useState(false);
  const [resendSuccess, setSuccess] = useState(false);

  const { count, isRunning, start } = useCountdown(OTP_RESEND_SECONDS);

  // Start the countdown immediately on mount
  useEffect(() => { start(); }, [start]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async ({ otp }) => {
    setError(null);
    setLoading(true);
    try {
      if (isConfirmEmail) {
        // 3. Email Confirmation flow: auth/confirm-email
        await confirmEmail({ email, otp });
        setSuccess(true);
        // Redirect to login after successful verification
        setTimeout(() => navigate(AUTH_ROUTES.LOGIN), 2500);
      } else {
        // Forgot password flow: Skip verification here and send OTP along with new password
        navigate(AUTH_ROUTES.RESET_PASSWORD, { state: { email, otp } });
      }
    } catch (err) {
      setError(err.message ?? 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResend(true);
    setSuccess(false);
    setError(null);
    try {
      // 4. Resend OTP flow: auth/resend-otp
      await resendOtp({ email });
      setSuccess(true);
      start(); // restart countdown
    } catch (err) {
      setError('Could not resend code. Please try again.');
    } finally {
      setResend(false);
    }
  };

  // Mask email for privacy: jo**@example.com
  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}${'*'.repeat(b.length)}${c}`)
    : 'your email';

  return (
    <AuthLayout
      image={illustration}
      title={AUTH_PAGE_COPY.verifyOtp.title}
      description={AUTH_PAGE_COPY.verifyOtp.description}
    >
      <AuthHeader
        title="Enter Verification Code "
        subtitle={
          <>
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-dark-blue">{maskedEmail}</span>.
            {' '}Check your inbox.
          </>
        }
        backLink={
          <Link
            to={AUTH_ROUTES.FORGOT_PASSWORD}
            className="inline-flex items-center gap-1.5 text-sm text-gray-text hover:text-main transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Change Email
          </Link>
        }
      />

      {serverError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      {resendSuccess && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✓ A new code has been sent to your email.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        {/* OTP boxes — controlled via React Hook Form Controller */}
        <div className="py-2">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <OTPInput
                onChange={field.onChange}
                error={errors.otp?.message}
              />
            )}
          />
        </div>

        <FormActions
          submitLabel="Verify Code"
          isLoading={isLoading}
        />
      </form>

      {/* Resend section */}
      <div className="mt-6 text-center">
        {isRunning ? (
          <p className="text-sm text-gray-text">
            Resend code in{' '}
            <span className="font-bold text-main tabular-nums">
              {String(Math.floor(count / 60)).padStart(2, '0')}:
              {String(count % 60).padStart(2, '0')}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="inline-flex items-center gap-1.5 text-sm text-main font-semibold hover:underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            <RefreshCw size={14} className={resendLoading ? 'animate-spin' : ''} />
            {resendLoading ? 'Sending…' : 'Resend Code'}
          </button>
        )}
      </div>
    </AuthLayout>
  );
};

export default OTPVerificationPage;
