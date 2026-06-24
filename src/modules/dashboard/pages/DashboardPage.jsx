import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/layouts';
import { Sparkles } from 'lucide-react';

const DashboardPage = () => {
  const [userName, setUserName] = useState('');  

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) {
        const info = JSON.parse(stored);
        setUserName(info.fullName?.split(' ')[0] || '');
      }
    } catch {}
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-main/10 rounded-full flex items-center justify-center mb-6">
          <Sparkles size={40} className="text-main" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
          Welcome back{userName ? `, ${userName}` : ''}!
        </h1>
        <p className="text-lg text-[#64748B]">
          You are currently logged into the administration panel. 
          Use the sidebar navigation to manage users, courses, and platform settings.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
