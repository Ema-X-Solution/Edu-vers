import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, UserCircle, FileUp, CheckCircle, Loader2 } from 'lucide-react';
import StudentStatCard from '../components/StudentStatCard';
import GPALineChart from '../components/GPALineChart';
import TopCoursesGrades from '../components/TopCoursesGrades';
import DashboardAnnouncements from '../components/DashboardAnnouncements';
import AcademicAssistantBanner from '../components/AcademicAssistantBanner';
import DashboardCommunities from '../components/DashboardCommunities';

import { DashboardLayout } from '@/app/layouts';
import { getStudentDashboardStats } from '../services/dashboardService';

const StudentDashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const stats = await getStudentDashboardStats();
        setData(stats);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <Loader2 size={48} className="text-main animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

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
            value={data?.currentGPA || '0.00'} 
            icon={TrendingUp} 
            progress={(data?.currentGPA / 4) * 100 || 0}
            statusText={data?.currentGPA < 2 ? "Academic Risk" : "Good Standing"}
            statusColor={data?.currentGPA < 2 ? "text-yellow-500" : "text-green-500"}
            statusDotColor={data?.currentGPA < 2 ? "bg-yellow-500" : "bg-green-500"}
            iconBgColor="bg-green-50"
            iconColor="text-green-500"
          />
          <StudentStatCard 
            title="Completed Courses" 
            value={<>{data?.completedCourses || 0} <span className="text-gray-400 text-lg">Courses</span></>} 
            icon={BookOpen} 
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
          />
          <StudentStatCard 
            title="Tasks Completed" 
            value={<>{data?.tasks?.completed || 0} <span className="text-gray-400 text-lg">/ {data?.tasks?.total || 0}</span></>} 
            icon={CheckCircle} 
            actionIcon={FileUp}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-500"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          
          {/* Middle Row: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[340px]">
            <div className="lg:col-span-8">
              <GPALineChart history={data?.GPAHistory || []} />
            </div>
            <div className="lg:col-span-4">
              <TopCoursesGrades courses={data?.topCoursesGrades || []} />
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
                <DashboardCommunities communities={data?.joinedCommunities || []} />
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
