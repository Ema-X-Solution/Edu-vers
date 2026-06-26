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
import AIInsightModal from '../components/AIInsightModal';
import { predictRisk, classifyGPA, fetchProfile, fetchCurrentGrades, recommendTrack } from '../services/aiService';
import { fetchAcademicRecords } from '../../users/services/usersService';

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
  const [aiModal, setAiModal] = useState({
    isOpen: false,
    title: '',
    isLoading: false,
    error: null,
    data: null,
    successStyle: false
  });

  const calculateAverageGrade = (grades) => {
    if (!grades || !Array.isArray(grades) || grades.length === 0) return 0;
    let totalScore = 0;
    grades.forEach(g => {
      const { midterm = 0, final = 0, practical = 0, assignment1 = 0, assignment2 = 0 } = g?.marks || {};
      totalScore += (Number(midterm) + Number(final) + Number(practical) + Number(assignment1) + Number(assignment2));
    });
    return totalScore / grades.length;
  };

  const calculateFailedCourses = (grades) => {
    if (!grades || !Array.isArray(grades) || grades.length === 0) return 0;
    let failedCount = 0;
    grades.forEach(g => {
      const { midterm = 0, final = 0, practical = 0, assignment1 = 0, assignment2 = 0 } = g?.marks || {};
      const total = Number(midterm) + Number(final) + Number(practical) + Number(assignment1) + Number(assignment2);
      if (total < 50) failedCount++;
    });
    return failedCount;
  };

  const handleRiskAI = async () => {
    setAiModal({ isOpen: true, title: 'Academic Risk Analysis', isLoading: true, error: null, data: null, successStyle: false });
    try {
      const userInfoStr = localStorage.getItem('user_info');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
      const studentId = userInfo.userId;
      if (!studentId) throw new Error('Student ID not found in session.');

      const profile = await fetchProfile(studentId);
      const gradesRes = await fetchCurrentGrades();
      const grades = gradesRes?.data || gradesRes; // depending on response structure

      const payload = {
        current_gba: data?.currentGPA || 0,
        total_credit_hours: data?.totalCredits || 0,
        semester: Number(profile?.academicYear) || 1,
        avg_grade: calculateAverageGrade(grades),
        failed_courses_count: calculateFailedCourses(grades),
        in_progress_count: data?.registeredCourses || 0,
        total_courses: (data?.completedCourses || 0) + (data?.registeredCourses || 0)
      };

      const result = await predictRisk(payload);
      let formattedRisk = '';
      if (result && typeof result === 'object' && result.hasOwnProperty('at_risk')) {
        const riskProb = (result.risk_probability * 100).toFixed(1);
        if (result.at_risk) {
          formattedRisk = `Academic Risk Alert: The AI model indicates that you are at risk with a probability of ${riskProb}%.\n\nIt is highly recommended to reach out to your academic advisor or professors for support.`;
        } else {
          formattedRisk = `Good Standing: The AI model indicates that you are not at risk. Your risk probability is only ${riskProb}%.\n\nKeep up the excellent work!`;
        }
      } else {
        formattedRisk = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      }
      setAiModal(prev => ({ ...prev, isLoading: false, data: formattedRisk }));
    } catch (err) {
      setAiModal(prev => ({ ...prev, isLoading: false, error: err.message || 'Failed to analyze academic risk' }));
    }
  };

  const handleGPAClassAI = async () => {
    setAiModal({ isOpen: true, title: 'GPA Classification Insights', isLoading: true, error: null, data: null, successStyle: true });
    try {
      const userInfoStr = localStorage.getItem('user_info');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
      const studentId = userInfo.userId;
      if (!studentId) throw new Error('Student ID not found in session.');

      const profile = await fetchProfile(studentId);
      const gradesRes = await fetchCurrentGrades();
      const grades = gradesRes?.data || gradesRes;

      const payload = {
        total_credit_hours: data?.totalCredits || 0,
        semester: Number(profile?.academicYear) || 1,
        avg_grade: calculateAverageGrade(grades),
        failed_courses_count: calculateFailedCourses(grades),
        total_courses: (data?.completedCourses || 0) + (data?.registeredCourses || 0),
        current_gba: data?.currentGPA || 0
      };

      const result = await classifyGPA(payload);
      let formattedGPA = '';
      if (result && typeof result === 'object' && result.model_prediction) {
        const prediction = result.model_prediction || result.rule_based_level;
        formattedGPA = `AI GPA Classification: Your academic standing is currently classified as "${prediction}".\n\n`;
        if (result.probabilities) {
          formattedGPA += "Detailed Probabilities:\n";
          Object.entries(result.probabilities).forEach(([key, value]) => {
            formattedGPA += `• ${key}: ${(value * 100).toFixed(1)}%\n`;
          });
        }
      } else {
        formattedGPA = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      }
      setAiModal(prev => ({ ...prev, isLoading: false, data: formattedGPA }));
    } catch (err) {
      setAiModal(prev => ({ ...prev, isLoading: false, error: err.message || 'Failed to classify GPA' }));
    }
  };

  const handleTrackRecommendationAI = async () => {
    setAiModal({ 
      isOpen: true, 
      title: 'Track Recommendation', 
      isLoading: true, 
      error: null, 
      data: null, 
      successStyle: true 
    });
    
    try {
      const userInfoStr = localStorage.getItem('user_info');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
      const studentId = userInfo.userId;
      if (!studentId) throw new Error('Student ID not found in session.');

      const recordsRes = await fetchAcademicRecords(studentId);
      const coursesData = recordsRes?.data || recordsRes || [];

      if (!coursesData || coursesData.length === 0) {
         throw new Error('No academic records found to recommend a track.');
      }

      const payload = {
        courses: coursesData.map(c => ({
          course_id: c.code,
          grade: Number(c.score) || 0
        }))
      };

      const result = await recommendTrack(payload);
      let formattedTrack = '';
      if (result && typeof result === 'object' && result.recommended_track_name) {
        formattedTrack = `Recommended Track: ${result.recommended_track_name}\n\n`;
        if (Array.isArray(result.probabilities)) {
          formattedTrack += "Track Probabilities:\n";
          const sortedProbs = [...result.probabilities].sort((a, b) => b.probability - a.probability);
          sortedProbs.forEach(track => {
            formattedTrack += `• ${track.track_name}: ${(track.probability * 100).toFixed(1)}%\n`;
          });
        }
      } else {
        formattedTrack = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      }
      setAiModal(prev => ({ ...prev, isLoading: false, data: formattedTrack }));
    } catch (err) {
      setAiModal(prev => ({ ...prev, isLoading: false, error: err.message || 'Failed to recommend track' }));
    }
  };
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
            onActionClick={handleGPAClassAI}
            onStatusClick={handleRiskAI}
          />
          <StudentStatCard 
            title="Completed Courses" 
            value={<>{data?.completedCourses || 0} <span className="text-gray-400 text-lg">Courses</span></>} 
            icon={BookOpen} 
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
            onActionClick={handleTrackRecommendationAI}
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
            <div className="lg:col-span-7 h-[420px]">
              <DashboardAnnouncements />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-6 h-[420px]">
              <AcademicAssistantBanner />
              <div className="flex-1 overflow-hidden">
                <DashboardCommunities communities={data?.joinedCommunities || []} />
              </div>
            </div>
          </div>
          
        </div>
        </div>
      </div>
      
      <AIInsightModal 
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal(prev => ({ ...prev, isOpen: false }))}
        title={aiModal.title}
        isLoading={aiModal.isLoading}
        error={aiModal.error}
        data={aiModal.data}
        successStyle={aiModal.successStyle}
        onRetry={aiModal.title.includes('Risk') ? handleRiskAI : (aiModal.title.includes('GPA') ? handleGPAClassAI : null)}
      />
    </DashboardLayout>
  );
};

export default StudentDashboardPage;
