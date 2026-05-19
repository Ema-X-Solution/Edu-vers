
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthBackLink from '../components/AuthBackLink';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/reset-password');
  };

  return (
    <AuthLayout
      imageKey="forgotPassword"
      title="Forgot your password!"
      subtitle="No worries, it happens. Enter your email address below and we'll send you a link to reset your password."
      showFooter
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-blue mb-8">Forgot Password?</h1>
        <p className="text-gray-text text-sm text-center">
          Enter your email address and we&apos;ll send you a 
          <br />
          link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="name@university.edu"
          icon={Mail}
          required
        />

        <Button type="submit" fullWidth className="gap-2">
          Send Reset Link
          <ArrowRight size={18} />
        </Button>
      </form>
      <div className="flex justify-center mt-5">
        
      <AuthBackLink />
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
