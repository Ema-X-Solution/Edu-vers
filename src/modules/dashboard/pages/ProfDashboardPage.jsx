import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { Card, Loader, Button } from '@/shared/ui';
import { User, Mail, Phone, MapPin, Building, Calendar, Hash, ArrowLeft, BookOpen, Clock, Trash2, Plus } from 'lucide-react';
import httpClient from '@/shared/services/httpClient';
import AddTaskModal from '../components/AddTaskModal';
import { DashboardLayout } from '@/app/layouts';

const ProfDashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // Assuming there's a route to get current user's profile
        // Alternatively, use user from localStorage
        const userStr = localStorage.getItem('user_info');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const id = userObj?.userId || userObj?.id || userObj?._id;

        if (!id) {
          throw new Error('No user ID found');
        }

        const res = await httpClient.get(`/users/profile/${id}`);
        const data = res?.data || res;
        
        setProfile(data?.profile || data?.user || data);
        setCourses(data?.enrolledCourses || []);
      } catch (err) {
        console.error('Error fetching prof profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);

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
        </div>
      </DashboardLayout>
    );
  }

  const role = profile.role || profile.userRole || 'Professor';
  const initials = (profile.fullName || profile.name || 'U').substring(0, 2).toUpperCase();
  const universityId = profile.universityId || profile.staffId || profile.academicId || 'N/A';
  const department = profile.department || profile.major || 'Computer Science Department';

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto pb-10 pt-6">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Academic Staff</h1>
              </div>
              <p className="text-gray-500 font-medium ml-1">
                Manage doctors and teaching assistants
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold transition-colors">
                <Trash2 size={16} /> Delete Task
              </button>
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors shadow-sm shadow-teal-500/20"
              >
                <Plus size={16} /> ADD Task
              </button>
            </div>
          </div>

          {/* Info Card */}
          <Card className="p-6 md:p-8 flex flex-col md:flex-row gap-8 border border-gray-200 shadow-sm rounded-2xl relative overflow-hidden mb-8">
            {/* Profile Image (Left side) */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden relative shrink-0 bg-gray-100 flex items-center justify-center text-5xl font-black text-gray-300 shadow-inner">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            
            {/* Info Details */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black text-dark-blue">{profile.fullName || profile.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${profile.status?.toLowerCase() !== 'inactive' ? 'bg-[#D1F1EB] text-[#0D9488]' : 'bg-red-50 text-red-600'}`}>
                  {profile.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-6">
                #{universityId} • {department}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  <span>{role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{profile.phone || '+201196387415'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{profile.address || 'Cairo, Egypt'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
            {/* Tabs Header */}
            <div className="flex items-center gap-8 px-8 border-b border-gray-100 bg-white">
              {['Personal Information'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-[#0D9488]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0D9488] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tabs Content */}
            <div className="p-8">
              {activeTab === 'Personal Information' && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User size={20} className="text-[#0D9488]" />
                    <h3 className="text-lg font-black text-dark-blue">Personal Details</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">DATE OF BIRTH</p>
                      <p className="text-sm font-bold text-dark-blue">{profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 14, 2002'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">GENDER</p>
                      <p className="text-sm font-bold text-dark-blue">{profile.gender || 'Male'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">NATIONALITY</p>
                      <p className="text-sm font-bold text-dark-blue">{profile.nationality || 'Egyptian'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">LANGUAGE</p>
                      <p className="text-sm font-bold text-dark-blue">Arabic, English</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">ADMISSION DATE</p>
                      <p className="text-sm font-bold text-dark-blue">Aug 25, 2021</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">ROLE</p>
                      <p className="text-sm font-bold text-dark-blue">{role}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <BookOpen size={20} className="text-[#0D9488]" />
                      <h3 className="text-lg font-black text-dark-blue">Current Enrolled Courses</h3>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold tracking-wide">
                      SEMESTER: FALL 2025
                    </span>
                  </div>
                  
                  {courses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50">
                            <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider rounded-l-xl">COURSE NAME</th>
                            <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">CODE</th>
                            <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">CREDITS</th>
                            <th className="py-3 px-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center rounded-r-xl">STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.map((course, idx) => (
                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                              <td className="py-4 px-4 text-sm font-bold text-dark-blue">
                                {course.courseName}
                              </td>
                              <td className="py-4 px-4 text-sm font-semibold text-gray-500 text-center">{course.code}</td>
                              <td className="py-4 px-4 text-sm font-semibold text-gray-600 text-center">{course.credits}</td>
                              <td className="py-4 px-4 text-center">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#D1F1EB] text-[#0D9488]">
                                  ACTIVE
                                </span>
                              </td>
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
            </div>
          </div>
        </div>
      
      {/* Modals */}
      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
        courses={courses}
      />
    </DashboardLayout>
  );
};

export default ProfDashboardPage;
