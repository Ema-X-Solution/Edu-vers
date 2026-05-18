import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Check } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-dark-blue mb-2">Welcome Back</h1>
          <p className="text-gray-text text-sm">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input 
            id="email"
            type="email"
            label="Email Address"
            placeholder="someone@example.com"
            icon={Mail}
            required
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-dark-blue">
                Password
              </label>
              <a href="#" className="text-xs text-main hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
            />
            <label htmlFor="remember" className="text-sm text-gray-text cursor-pointer">
              Remember me
            </label>
          </div>

          <Button type="submit" fullWidth className="mt-2">
            Login
          </Button>

          <p className="text-center text-sm text-gray-text mt-4">
            Don't have an account? <a href="#" className="text-main font-medium hover:underline">Sign up for free</a>
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">or continue with</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" type="button" fullWidth className="flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" fullWidth className="flex items-center justify-center gap-2">
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4219 11.3932C15.4057 8.01689 18.1517 6.41724 18.2713 6.34212C16.6974 4.0436 14.3015 3.69376 13.4883 3.65934C11.5284 3.46199 9.6385 4.81177 8.63661 4.81177C7.61803 4.81177 6.07062 3.68412 4.43636 3.7144C2.30822 3.74606 0.37035 4.88248 0.179374 8.19062C-0.207869 14.8827 3.50419 21.3653 6.78699 21.3653C8.38466 21.3653 9.02297 20.3957 10.9568 20.3957C12.8732 20.3957 13.4475 21.3653 15.1105 21.3653C18.4239 21.3653 20.0631 16.3262 20.2541 15.932C20.22 15.9182 15.4381 14.0883 15.4219 11.3932Z" fill="#0F172A"/>
                <path d="M12.2471 2.37803C13.1256 1.31175 13.7226 0.640243 13.5658 0C13.4402 0.589255 12.8465 1.32139 12.0226 2.30501C11.1306 3.37684 10.4578 4.07584 10.6467 4.69724C10.7876 4.70689 11.3414 4.72205 12.2471 2.37803Z" fill="#0F172A"/>
              </svg>
              Apple
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
