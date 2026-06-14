import React from 'react';
import { ROUTES } from '@/shared/constants';
import { useNavigate } from 'react-router-dom';

const ProfDashboardPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-app">
      <h1 className="text-3xl font-bold text-dark-blue mb-4">Professor Dashboard</h1>
      <p className="text-gray-text mb-8">This page is coming soon...</p>
      <button 
        onClick={() => {
          localStorage.removeItem('auth_token');
          navigate(ROUTES.LOGIN);
        }}
        className="px-6 py-2 bg-main text-white rounded-lg font-medium hover:bg-main-hover transition"
      >
        Log out
      </button>
    </div>
  );
};

export default ProfDashboardPage;
