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
        setCourses(data?.courses || []);
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
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors shadow-sm shadow-teal-500/20"
              >
                <Plus size={16} /> ADD Task
              </button>
            </div>
          </div>

          {/* Tasks List Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#0D9488]" />
                <h3 className="text-lg font-black text-dark-blue">Tasks Overview</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">TASK NAME</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">TYPE</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">COURSE</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">DEADLINE</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Static Data for Tasks List until API is ready */}
                  {[
                    { id: 1, name: 'Assignment 1: Data Structures', type: 'Assignment', course: 'Computer Science', deadline: '2026-08-15T23:59:00Z' },
                    { id: 2, name: 'Midterm Project', type: 'Project', course: 'Machine Learning', deadline: '2026-08-20T23:59:00Z' },
                    { id: 3, name: 'Quiz 2', type: 'Quiz', course: 'Physics', deadline: '2026-08-10T23:59:00Z' }
                  ].map((task, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-dark-blue">
                        {task.name}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-500 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                          {task.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">{task.course}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">
                        {new Date(task.deadline).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-xs font-bold text-[#0D9488] hover:bg-[#D1F1EB] px-3 py-1.5 rounded-lg transition-colors">
                            View Details
                          </button>
                          <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
