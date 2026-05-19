import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';
import PasswordRequirements from '../components/PasswordRequirements';
import Button from '../components/Button';
import AuthBackLink from '../components/AuthBackLink';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <AuthLayout
      imageKey="resetPassword"
      title="Forgot your password!"
      subtitle="No worries, it happens. Enter your email address below and we'll send you a link to reset your password."
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-lighter-main text-main">
          <LockKeyhole size={26} />
        </div>
        <h1 className="text-2xl font-bold text-dark-blue mb-2">Create New Password</h1>
        <p className="text-gray-text text-sm max-w-xs">
          Please enter your new password below to reset your account password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordInput
          id="new-password"
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <PasswordInput
          id="confirm-password"
          label="Confirm Password"
          placeholder="Re-enter new password"
          required
        />

        <PasswordRequirements password={password} />

        <Button type="submit" fullWidth className="mt-2">
          Reset Password
        </Button>
      </form>

      <div className="text-center">
        <AuthBackLink />
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
