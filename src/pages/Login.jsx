
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import SocialAuthButtons from '../components/SocialAuthButtons';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      imageKey="login"
      title="Your Academic Universe in One Place"
      subtitle="Join thousands of students and educators managing their academic journey with seamless digital tools."
      formCard={false}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl shadow-[0px_1px_2px_0px_#0000000D;] border border-[#E2E8F0] p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-dark-blue mb-2">Welcome Back</h1>
            <p className="text-gray-text text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@university.edu"
              icon={Mail}
              required
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-dark-blue">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-main hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput id="password" required />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-full border-gray-300 text-main focus:ring-main"
              />
              <span className="text-sm text-gray-text">Remember me</span>
            </label>

            <Button type="submit" fullWidth className="mt-1">
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-text">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-main font-medium hover:underline">
                Sign up for free
              </Link>
            </p>
          </form>
        </div>

        <SocialAuthButtons />
      </div>
    </AuthLayout>
  );
};

export default Login;
