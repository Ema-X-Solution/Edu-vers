import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import AuthHeader from '../components/AuthHeader';
import FormActions from '../components/FormActions';
import { FormField, Input } from '@/shared/ui';
import { loginSchema } from '../validations/loginSchema';
import PasswordField from '../components/PasswordField';
import useAuth from '../hooks/useAuth';
import { AUTH_ROUTES, AUTH_PAGE_COPY } from '../constants/authConstants';

// Drop your illustration image into src/assets/ and import it here:
// import illustration from '@/assets/login-illustration.png';
const illustration = null;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error: serverError } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const onSubmit = (data) => login(data, { setLoading: setIsLoading });

  return (
    <AuthLayout
      image={illustration}
      title={AUTH_PAGE_COPY.login.title}
      description={AUTH_PAGE_COPY.login.description}
    >
      <AuthHeader
        title="Welcome Back "
        subtitle="Please enter your details to sign in to your account."
      />

      {/* Server-level error */}
      {serverError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Email */}
        <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        {/* Password */}
        <FormField htmlFor="password" error={errors.password?.message}>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="text-sm font-medium text-dark-blue">Password</label>
            <Link to={AUTH_ROUTES.FORGOT_PASSWORD} className="text-xs text-main font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordField
            id="password"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        {/* Remember me */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 accent-main cursor-pointer"
            {...register('remember')}
          />
          <span className="text-sm text-gray-text">Remember me</span>
        </label>

        <FormActions
          submitLabel="Sign In"
          isLoading={isLoading}
        />

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400">or continue with</span>
          </div>
        </div>

        {/* Social buttons */}
        {/* <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 h-11 flex items-center justify-center gap-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-dark-blue hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2C17.64 8.57 17.58 7.95 17.48 7.36H9v2.74h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.26h2.91C16.66 13.25 17.64 11.4 17.64 9.2Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33C2.44 15.98 5.48 18 9 18Z" fill="#34A853"/>
              <path d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.51.45 3.44 1.34l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex-1 h-11 flex items-center justify-center gap-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-dark-blue hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path d="M13.42 10.39C13.4 7.02 16.15 5.42 16.27 5.34 14.7 3.04 12.3 2.69 11.49 2.66 9.53 2.46 7.64 3.81 6.64 3.81c-1.02 0-2.57-1.13-4.2-1.1C.31 2.74-1.63 3.88-1.82 7.19c-.39 6.69 3.32 13.17 6.6 13.17 1.6 0 2.24-.97 4.17-.97 1.92 0 2.49.97 4.15.97 3.31 0 4.95-5.04 5.14-5.43-.04-.01-4.81-1.84-4.82-4.54Z" fill="#0F172A"/>
              <path d="M10.25 1.38C11.13.31 11.72-.36 11.57-1c-.13.59-.73 1.32-1.55 2.31-.89 1.07-1.56 1.77-1.37 2.39.14.01.69.02 1.6-1.32Z" fill="#0F172A"/>
            </svg>
            Apple
          </button>
        </div> */}
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
