/**
 * useAuth — encapsulates login business logic.
 * Keeps LoginPage a pure rendering shell.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { AUTH_ROUTES } from '../constants/authConstants';

const useAuth = () => {
  const navigate   = useNavigate();
  const [error, setError] = useState(null);

  const login = async (formData, { setLoading }) => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser(formData);
      
      const { tokens, userRole, fullName, userId, userEmail } = res;
      const accessToken = tokens?.accessToken || res.token;
      
      if (accessToken) {
        localStorage.setItem('auth_token', accessToken);
      }
      if (tokens?.refreshToken) {
        localStorage.setItem('refresh_token', tokens.refreshToken);
      }
      
      if (userRole) {
        localStorage.setItem('user_info', JSON.stringify({ fullName, userId, userEmail, userRole }));
      }

      const role = (userRole || '').toLowerCase();
      if (role === 'student') {
        navigate(AUTH_ROUTES.STUDENT_DASHBOARD);
      } else if (role === 'prof' || role === 'professor') {
        navigate(AUTH_ROUTES.PROF_DASHBOARD);
      } else {
        navigate(AUTH_ROUTES.STUDENTS || '/dashboard/students');
      }
    } catch (err) {
      if (err.message === 'You should confirm your email first, new OTP sent to your email') {
        navigate(AUTH_ROUTES.VERIFY_OTP, { state: { email: formData.email, isConfirmEmail: true } });
      } else {
        setError(err.message ?? 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, error };
};

export default useAuth;
