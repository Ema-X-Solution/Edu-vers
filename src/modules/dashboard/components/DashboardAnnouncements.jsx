import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/ui';
import { FileUp, Loader2, Megaphone, PenTool } from 'lucide-react';
import { fetchAnnouncements, fetchCourseAssessments } from '../../assessments/services/assessmentsService';
import { fetchUserProfile, fetchAcademicRecords } from '../../users/services/usersService';
import SubmitAssessmentModal from './SubmitAssessmentModal';

const DashboardAnnouncements = () => {
  const [activeTab, setActiveTab] = useState('Announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAnnouncements();
        const data = Array.isArray(res?.data) ? res.data
          : Array.isArray(res) ? res
          : res?.announcements || [];
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  useEffect(() => {
    const loadStudentCourses = async () => {
      try {
        const userInfoStr = localStorage.getItem('user_info');
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
        const studentId = userInfo.userId || userInfo._id;
        if (!studentId) return;

        const resProfile = await fetchUserProfile(studentId);
        const enrolled = resProfile?.data?.enrolledCourses || resProfile?.enrolledCourses || [];

        let records = [];
        try {
          const resRecords = await fetchAcademicRecords(studentId);
          records = resRecords?.data || resRecords || [];
        } catch (err) {
          console.error('Failed to load academic records for course mapping', err);
        }

        const mappedCourses = enrolled.map(course => {
          const record = records.find(r => r.code === course.code);
          return {
            ...course,
            _id: record ? record.courseId : course.code
          };
        });

        setCourses(mappedCourses);
        if (mappedCourses.length > 0) {
          setSelectedCourseId(mappedCourses[0]._id);
        }
      } catch (err) {
        console.error('Failed to load courses for tasks', err);
      }
    };
    loadStudentCourses();
  }, []);

  useEffect(() => {
    if (activeTab === 'Tasks' && selectedCourseId) {
      const loadTasks = async () => {
        setIsTasksLoading(true);
        try {
          const res = await fetchCourseAssessments(selectedCourseId);
          setTasks(res?.data || res || []);
        } catch (err) {
          console.error('Failed to load tasks', err);
        } finally {
          setIsTasksLoading(false);
        }
      };
      loadTasks();
    }
  }, [activeTab, selectedCourseId]);

  const handleOpenSubmit = (item) => {
    setSelectedAssessment(item);
    setIsSubmitModalOpen(true);
  };

  const getUrgencyStyle = (timeLeft = '') => {
    const lower = timeLeft.toLowerCase();
    if (lower.includes('hour') || lower === 'today' || lower.includes('1 day') || lower.includes('tomorrow'))
      return { dotColor: 'bg-red-500', textColor: 'text-red-500', label: timeLeft || 'Due Soon' };
    if (lower.includes('2 day') || lower.includes('3 day'))
      return { dotColor: 'bg-orange-400', textColor: 'text-orange-500', label: timeLeft };
    return { dotColor: 'bg-teal-500', textColor: 'text-teal-600', label: timeLeft || 'Active' };
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <>
      <Card className="p-0 overflow-hidden flex flex-col h-full">
        {/* Header Tabs */}
        <div className="flex items-center gap-6 px-5 border-b border-gray-100 shrink-0">
          {['Announcements', 'Tasks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-base font-bold transition-colors relative ${activeTab === tab ? 'text-dark-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0D9488] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto flex flex-col">
          {activeTab === 'Announcements' && (
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-gray-400">
                  <Loader2 className="w-7 h-7 animate-spin mb-2" />
                  <p className="text-sm">Loading announcements...</p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-gray-400">
                  <Megaphone size={30} className="mb-2 opacity-40" />
                  <p className="text-sm font-medium">No announcements right now</p>
                </div>
              ) : (
                announcements.map((item, index) => {
                  const urgency = getUrgencyStyle(item.timeLeft || '');
                  const deadline = formatDeadline(item.deadlineDate || item.deadline || item.dueDate);

                  return (
                    <div
                      key={item.assessmentId || item._id || item.id || index}
                      className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                        index !== announcements.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <PenTool size={18} className="text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-dark-blue text-sm leading-tight mb-0.5">
                            {item.title || item.name || 'Announcement'}
                          </h4>
                          <p className="text-xs text-gray-400 mb-1">
                            {item.courseName || item.course?.name || item.course || 'General'}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${urgency.dotColor}`} />
                            <span className={`text-xs font-semibold ${urgency.textColor}`}>
                              {urgency.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs font-bold text-dark-blue mb-0.5">Deadline</p>
                          <p className="text-xs text-gray-400">{deadline}</p>
                        </div>
                        <button
                          onClick={() => handleOpenSubmit(item)}
                          className="w-10 h-10 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white flex items-center justify-center transition-colors shadow-sm shadow-teal-500/20"
                        >
                          <FileUp size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'Tasks' && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-100">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-gray-200 text-sm font-bold text-dark-blue py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all cursor-pointer"
                >
                  {courses.length === 0 ? (
                    <option value="">No enrolled courses</option>
                  ) : (
                    courses.map(c => (
                      <option key={c._id || c.id || c.code} value={c._id || c.id || c.code}>
                        {c.courseName || c.name || c.code}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex-1 overflow-auto">
                {isTasksLoading ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-gray-400">
                    <Loader2 className="w-7 h-7 animate-spin mb-2" />
                    <p className="text-sm">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-gray-400">
                    <FileUp size={30} className="mb-2 opacity-40" />
                    <p className="text-sm font-medium">No tasks for this course</p>
                  </div>
                ) : (
                  tasks.map((item, index) => {
                    const deadline = formatDeadline(item.deadline);

                    return (
                      <div
                        key={item._id || index}
                        className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                          index !== tasks.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <FileUp size={18} className="text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-dark-blue text-sm leading-tight mb-0.5">
                              {item.name || 'Task'}
                            </h4>
                            <p className="text-xs text-gray-400 mb-1">
                              Max Mark: {item.maxMarkAssessment || 'N/A'}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-teal-500" />
                              <span className="text-xs font-semibold text-teal-600 uppercase">
                                {item.type || 'Assessment'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs font-bold text-dark-blue mb-0.5">Deadline</p>
                            <p className="text-xs text-gray-400">{deadline}</p>
                          </div>
                          <button
                            onClick={() => handleOpenSubmit(item)}
                            className="w-10 h-10 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white flex items-center justify-center transition-colors shadow-sm shadow-teal-500/20"
                          >
                            <FileUp size={17} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <SubmitAssessmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        assessment={selectedAssessment}
      />
    </>
  );
};

export default DashboardAnnouncements;
