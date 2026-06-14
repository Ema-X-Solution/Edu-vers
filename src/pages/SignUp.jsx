import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import RoleSelector from '../components/RoleSelector';

const SignUp = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      variant="signup"
      title="Smart Learning Awaits"
      subtitle="Join a global community of students and educators redefining the future of digital education."
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-blue mb-2">Create Account</h1>
        <p className="text-sm text-gray-text">Fill in your details to start your journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <RoleSelector value={role} onChange={setRole} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="full-name" label="Full Name" placeholder="John Doe" required />
          <Input id="student-id" label="Student ID" placeholder="2024-XXXX" required />
        </div>

        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="john@university.edu"
          icon={Mail}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput id="password" label="Password" required />
          <PasswordInput id="confirm-password" label="Confirm Password" required />
        </div>

        <Button
          type="submit"
          fullWidth
          className="mt-2 shadow-[0_8px_20px_rgba(21,179,146,0.35)]"
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-text">
          Already have an account?{' '}
          <Link to="/login" className="text-main font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
