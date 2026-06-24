import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Card, Loader, Button } from '@/shared/ui';
import { fetchUserProfile } from '../services/usersService';
import { User, Mail, Phone, MapPin, Building, Calendar, Hash, ArrowLeft, BookOpen, Star, Clock, CheckCircle, GraduationCap, Edit2, Trash2 } from 'lucide-react';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState('Enrolled Courses');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await fetchUserProfile(id);
        const data = res?.data || res;
        
        setProfile(data?.profile || data?.user || data);
        setStats(data?.statistics || null);
        setCourses(data?.enrolledCourses || []);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" className="text-[#0D9488]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-red-500 font-bold text-lg mb-4">{error || 'User not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0D9488] hover:underline font-medium"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const role = profile.role || profile.userRole || (profile.studentId ? 'Student' : 'Staff');
  const initials = (profile.fullName || profile.name || 'U').substring(0, 2).toUpperCase();

  const isStudent = role.toLowerCase() === 'student';
  const universityId = profile.universityId || profile.studentId || profile.academicId || 'N/A';
  const department = profile.department || profile.major || 'Computer Science Department';
  const academicYear = profile.academicYear || '4';

  const statsCards = [
    { label: 'CURRENT GPA', value: stats?.currentGPA?.toFixed(2) || '0.00', bg: 'bg-[#D1F1EB]', text: 'text-dark-blue', sub: '' },
    { label: 'COMPLETED', value: stats?.completedCourses || 0, bg: 'bg-white border border-gray-100 shadow-sm', text: 'text-dark-blue', sub: 'Courses' },
    { label: 'REGISTERED', value: stats?.registeredCourses || 0, bg: 'bg-white border border-gray-100 shadow-sm', text: 'text-dark-blue', sub: 'Active Courses' },
    { label: 'TOTAL CREDITS', value: stats?.totalCredits || 0, bg: 'bg-white border border-gray-100 shadow-sm', text: 'text-dark-blue', sub: 'Credit Hours' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto pb-10">
        
        {/* Page Header (Matching the screenshot) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-[#0D9488] transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{isStudent ? 'Students' : 'Academic Staff'}</h1>
            </div>
            <p className="text-gray-500 font-medium ml-8">
              {isStudent ? 'Manage all registered students and their academic records' : 'Manage academic staff records and details'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold transition-colors">
              <Trash2 size={16} /> Delete {isStudent ? 'Student' : 'Staff'}
            </button>
            <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors">
              <Edit2 size={16} /> Edit {isStudent ? 'Student' : 'Staff'}
            </button>
          </div>
        </div>

        {/* Top Section: Info & Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Left: Info Card */}
          <Card className="xl:col-span-2 p-6 flex flex-col md:flex-row gap-6 border border-gray-200 shadow-sm rounded-2xl relative overflow-hidden">
            <div className="flex-1 z-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black text-dark-blue">{profile.fullName || profile.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${profile.status?.toLowerCase() !== 'inactive' ? 'bg-[#D1F1EB] text-[#0D9488]' : 'bg-red-50 text-red-600'}`}>
                  {profile.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-4">
                #{universityId} • {department}
              </p>
              
              {isStudent && (
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-6">
                  <GraduationCap size={18} className="text-gray-400" />
                  <span>Senior Year (Year {academicYear})</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-500 text-sm mt-auto">
                <Mail size={16} className="text-gray-400" />
                <span>{profile.email}</span>
              </div>
            </div>

            {/* Profile Image (Right side of info card) */}
            <div className="w-full md:w-56 h-48 rounded-xl overflow-hidden relative z-10 shrink-0 bg-gray-100 flex items-center justify-center text-5xl font-black text-gray-300">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </Card>

          {/* Right: Stats Grid */}
          <div className="xl:col-span-1 grid grid-cols-2 gap-4">
            {statsCards.map((stat, idx) => (
              <div key={idx} className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center ${stat.bg}`}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-black mb-1 ${stat.text}`}>{stat.value}</h3>
                {stat.sub && <p className="text-[10px] font-semibold text-gray-400">{stat.sub}</p>}
              </div>
            ))}
          </div>

        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
          {/* Tabs Header */}
          <div className="flex items-center gap-8 px-6 border-b border-gray-100 bg-white">
            {['Enrolled Courses', 'Grades', 'Academic Summary'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-dark-blue' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-dark-blue rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className="p-6">
            
            {activeTab === 'Enrolled Courses' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={20} className="text-[#0D9488]" />
                  <h3 className="text-lg font-black text-dark-blue">Current Enrolled Courses</h3>
                </div>
                
                {courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider rounded-l-xl">COURSE NAME</th>
                          <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">CODE</th>
                          <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">DOCTOR</th>
                          <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider rounded-r-xl">CREDITS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course, idx) => (
                          <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors group">
                            <td className="py-4 px-4">
                              <span 
                                onClick={() => navigate(profile.studentId ? `/student-courses/${course._id || course.code}` : `/courses/${course._id || course.code}`)}
                                className="text-sm font-bold text-dark-blue cursor-pointer group-hover:text-[#0D9488] transition-colors"
                              >
                                {course.courseName}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold text-gray-500">{course.code}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-gray-600">{course.doctor || 'N/A'}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-gray-600">{course.credits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400 font-semibold">No enrolled courses found.</div>
                )}
              </div>
            )}

            {activeTab === 'Grades' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={20} className="text-[#0D9488]" />
                  <h3 className="text-lg font-black text-dark-blue">Current Enrolled Courses</h3>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/30">
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">COURSE NAME</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">COURSE CODE</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">INSTRUCTOR</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">MID</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">PRACTICAL</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">FINAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* UI structure ready for when grades API is ready */}
                      {courses.length > 0 ? (
                        courses.map((course, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue">{course.courseName}</td>
                            <td className="py-5 px-6 text-sm font-semibold text-gray-500">{course.code}</td>
                            <td className="py-5 px-6 text-sm font-semibold text-gray-500">{course.doctor || 'N/A'}</td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">--</td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">--</td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">--</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-10 text-center text-gray-400 font-semibold">No grades available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Academic Summary' && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <GraduationCap size={48} className="mb-4 opacity-20" />
                <p className="font-semibold">Academic summary data will be available here.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
