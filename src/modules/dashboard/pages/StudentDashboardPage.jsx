import React from 'react';
import { TrendingUp, BookOpen, UserCircle, FileUp } from 'lucide-react';
import StudentStatCard from '../components/StudentStatCard';
import GPALineChart from '../components/GPALineChart';
import TopCoursesGrades from '../components/TopCoursesGrades';
import DashboardFilter from '../components/DashboardFilter';
import DashboardAnnouncements from '../components/DashboardAnnouncements';
import AcademicAssistantBanner from '../components/AcademicAssistantBanner';
import DashboardCommunities from '../components/DashboardCommunities';

import { DashboardLayout } from '@/app/layouts';

const StudentDashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="bg-bg-app">
        <div className="mb-8">
        <h1 className="text-3xl font-black text-dark-blue mb-1">Dashboard Overview</h1>
        <p className="text-gray-text text-sm">Good morning, here is what's happening today.</p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StudentStatCard 
            title="Current GPA" 
            value="1.78" 
            icon={TrendingUp} 
            progress={35}
            statusText="Academic Risk"
            statusColor="text-yellow-500"
            statusDotColor="bg-yellow-500"
            iconBgColor="bg-green-50"
            iconColor="text-green-500"
          />
          <StudentStatCard 
            title="Registered Courses" 
            value={<>35 <span className="text-gray-400 text-lg">/ 54</span></>} 
            icon={BookOpen} 
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StudentStatCard 
            title="Applied Training" 
            value={<>1 <span className="text-gray-400 text-lg">/ 6</span></>} 
            icon={UserCircle} 
            actionIcon={FileUp}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-500"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          
          {/* Middle Row: Charts & Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[340px]">
            <div className="lg:col-span-6">
              <GPALineChart />
            </div>
            <div className="lg:col-span-3">
              <TopCoursesGrades />
            </div>
            <div className="lg:col-span-3">
              <DashboardFilter />
            </div>
          </div>
          
          {/* Bottom Row: Announcements & Communities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-9 h-[400px]">
              <DashboardAnnouncements />
            </div>
            <div className="lg:col-span-3 flex flex-col gap-6 h-[400px]">
              <AcademicAssistantBanner />
              <div className="flex-1 overflow-hidden">
                <DashboardCommunities />
              </div>
            </div>
          </div>
          
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardPage;
