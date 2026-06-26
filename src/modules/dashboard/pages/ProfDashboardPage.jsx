import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { Card, Loader, Button } from '@/shared/ui';
import { User, Mail, Phone, MapPin, Building, Calendar, Hash, ArrowLeft, BookOpen, Clock, Trash2, Plus, ChevronDown, Loader2 } from 'lucide-react';
import httpClient from '@/shared/services/httpClient';
import { fetchCourseAssessments } from '../../assessments/services/assessmentsService';
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

  // Tasks state
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null); // task object to delete
  const [isDeleting, setIsDeleting] = useState(false);

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
        const fetchedCourses = data?.courses || [];
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setSelectedCourseId(fetchedCourses[0].id || fetchedCourses[0]._id || '');
        }
      } catch (err) {
        console.error('Error fetching prof profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  // Fetch tasks when selected course changes
  useEffect(() => {
    if (!selectedCourseId) return;
    const loadTasks = async () => {
      setIsTasksLoading(true);
      try {
        const res = await fetchCourseAssessments(selectedCourseId);
        setTasks(res?.data || res || []);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setTasks([]);
      } finally {
        setIsTasksLoading(false);
      }
    };
    loadTasks();
  }, [selectedCourseId]);

  const handleDeleteTask = async () => {
    if (!deleteTarget?._id) return;
    try {
      setIsDeleting(true);
      await httpClient.delete(`/assessments/${deleteTarget._id}`);
      setTasks(prev => prev.filter(t => t._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

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
            {/* Section header + course select box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#0D9488]" />
                <h3 className="text-lg font-black text-dark-blue">Tasks Overview</h3>
              </div>

              {/* Course filter select */}
              <div className="relative sm:w-72">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-gray-200 text-sm font-bold text-dark-blue py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all cursor-pointer appearance-none"
                >
                  {courses.length === 0 ? (
                    <option value="">No courses assigned</option>
                  ) : (
                    courses.map(c => (
                      <option key={c.id || c._id} value={c.id || c._id}>
                        {c.name} ({c.code})
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="overflow-x-auto relative">
              {isTasksLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <Loader2 size={32} className="text-[#0D9488] animate-spin" />
                </div>
              )}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">TASK NAME</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">TYPE</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">MAX MARK</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">DEADLINE</th>
                    <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 && !isTasksLoading ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-gray-400 font-semibold">
                        <BookOpen size={36} className="mx-auto mb-3 opacity-20" />
                        No tasks found for this course.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task, idx) => (
                      <tr key={task._id || idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                        <td className="py-4 px-6 text-sm font-bold text-dark-blue">
                          {task.name || 'Untitled Task'}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-500 text-center">
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold capitalize">
                            {task.type || 'Assessment'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">
                          {task.maxMarkAssessment ?? 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {task.fileUrl && (
                              <a
                                href={task.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-[#0D9488] hover:bg-[#D1F1EB] px-3 py-1.5 rounded-lg transition-colors"
                              >
                                View File
                              </a>
                            )}
                             <button
                              onClick={() => setDeleteTarget(task)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      
      {/* Delete Confirmation Popup */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-black text-dark-blue text-center mb-2">Delete Task</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <span className="font-bold text-dark-blue">"{deleteTarget.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-sm shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
        courses={courses}
      />
    </DashboardLayout>
  );
};

export default ProfDashboardPage;
