import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, Calendar, Search, ArrowRight, BookOpen, Clock, User, CheckCircle, Star } from 'lucide-react';
import DashboardLayout from '@/app/layouts/DashboardLayout';
import { Button, Card } from '@/shared/ui';
import StudentScheduleModal from '../components/StudentScheduleModal';
import AddCoursesModal from '../components/AddCoursesModal';
import SemesterPickerModal from '../components/SemesterPickerModal';
import { fetchCourses, fetchStudentRegistrationCards } from '../services/coursesService';

// ─── Course Card for Student ──────────────────────────────────────────────────
const StudentCourseCard = ({ course, onView }) => {
  const isTraining = course.isTraining;

  return (
    <Card
      noPadding
      className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
      onClick={() => onView(course._id)}
    >
      {/* Card Top Banner */}
      <div className={`h-28 relative flex items-center justify-center ${isTraining ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-[#0D9488] to-blue-600'}`}>
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {isTraining
            ? <ArrowRight size={28} className="text-white" />
            : <BookOpen size={28} className="text-white" />
          }
        </div>
        {/* Code badge */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
          {course.code}
        </div>
        {/* Training badge */}
        {isTraining && (
          <div className="absolute top-3 right-3 bg-emerald-400/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-white">
            Training
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-slate-800 mb-1 leading-tight group-hover:text-teal-600 transition-colors">
          {course.name}
        </h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">
          {course.description || 'No description provided.'}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-5">
          {course.professorName && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User size={13} className="text-teal-500 shrink-0" />
              <span className="font-medium truncate">{course.professorName}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={13} className="text-blue-500 shrink-0" />
            <span className="font-medium">{course.creditHours} Credit Hours</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <span className="px-2 py-0.5 bg-gray-100 rounded-md">{course.semester}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-md">Year {course.academicYear}</span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={(e) => { e.stopPropagation(); onView(course._id); }}
          className="w-full h-10 rounded-xl border border-teal-200 text-teal-600 hover:bg-teal-50 text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRight size={16} />
          View Details
        </button>
      </div>
    </Card>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const StudentCoursesPage = () => {
  const navigate = useNavigate();
  
  // Modals state
  const [isSemesterPickerOpen, setIsSemesterPickerOpen] = useState(false);
  const [activeFlow, setActiveFlow] = useState(null); // 'SCHEDULE' | 'REGISTER'
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAddCoursesOpen, setIsAddCoursesOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // Data state
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Registration cards stats from API
  const [studentCards, setStudentCards] = useState(null);
  const [openRegister, setOpenRegister] = useState(false);

  // Fetch student stats on mount
  useEffect(() => {
    const loadCards = async () => {
      try {
        const stored = localStorage.getItem('user_info');
        const userId = stored ? JSON.parse(stored)?.userId || JSON.parse(stored)?._id : null;
        if (!userId) return;
        const res = await fetchStudentRegistrationCards(userId);
        const data = res?.data || res;
        setStudentCards(data);
        setOpenRegister(data?.openRegister === true || data?.openRigister === true);
      } catch (err) {
        console.error('Failed to load student cards:', err);
      }
    };
    loadCards();
  }, []);

  const stats = [
    {
      label: 'COMPLETED',
      value: studentCards ? `${studentCards.completedCoursesCount ?? 0} Courses` : '-- Courses',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-500',
    },
    {
      label: 'AVAILABLE',
      value: studentCards ? `${studentCards.availableCourseCount ?? 0} Courses` : '-- Courses',
      icon: BookOpen,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
    },
    {
      label: 'TOTAL CREDITS',
      value: studentCards ? `${studentCards.totalCredits ?? 0} Hours` : '-- Hours',
      icon: Clock,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-500',
    },
    {
      label: 'TASKS',
      value: studentCards ? `${studentCards.tasks ?? 0}` : '--',
      icon: Star,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-500',
    },
  ];

  const loadCourses = async (p = 1) => {
    setIsLoading(true);
    try {
      const res = await fetchCourses({ search, page: p, limit: 12 });
      setCourses(res?.data || []);
      setMeta(res?.meta || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    setPage(1);
    const timer = setTimeout(() => loadCourses(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Page change
  useEffect(() => {
    if (page > 1) loadCourses(page);
  }, [page]);

  // Handle flow selection
  const startFlow = (flowType) => {
    setActiveFlow(flowType);
    setIsSemesterPickerOpen(true);
  };

  const handleSemesterSelected = (semester) => {
    setSelectedSemester(semester);
    setIsSemesterPickerOpen(false);
    
    if (activeFlow === 'SCHEDULE') {
      setIsScheduleOpen(true);
    } else if (activeFlow === 'REGISTER') {
      setIsAddCoursesOpen(true);
    }
  };

  const handleAddCoursesClose = (wasSuccessful) => {
    setIsAddCoursesOpen(false);
    if (wasSuccessful) {
      // Refresh the page data after a successful registration
      loadCourses(1);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto pb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Courses & Registration</h1>
            <p className="text-gray-500 font-medium">Browse available courses and manage your registrations</p>
          </div>
          <div className="flex items-center gap-3">
            {openRegister ? (
              <Button
                variant="primary"
                className="flex items-center gap-2 font-bold py-2.5 px-4 bg-teal-500 hover:bg-teal-600"
                onClick={() => startFlow('REGISTER')}
              >
                <Plus size={18} />
                Add Course
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2 font-bold py-2.5 px-4 bg-white border-gray-200"
                onClick={() => startFlow('SCHEDULE')}
              >
                <Calendar size={18} className="text-gray-500" />
                View My Schedule
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.textColor}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-wider mb-0.5">{stat.label}</p>
                <h3 className="text-xl font-bold text-slate-800">{stat.value}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-[420px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses by name or code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-dark-blue placeholder:text-gray-400 outline-none focus:border-[#0D9488] transition-colors bg-white shadow-sm"
          />
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-8 h-8 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-semibold">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <BookOpen size={48} className="mb-3 opacity-30" />
            <p className="font-semibold">No courses found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <StudentCourseCard
                  key={course._id}
                  course={course}
                  onView={(id) => navigate(`/student-courses/${id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${p === page ? 'bg-teal-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <SemesterPickerModal
        isOpen={isSemesterPickerOpen}
        onClose={() => setIsSemesterPickerOpen(false)}
        onSelect={handleSemesterSelected}
        title={activeFlow === 'SCHEDULE' ? 'View Schedule' : 'Add Courses'}
      />

      <StudentScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        semester={selectedSemester}
      />

      <AddCoursesModal
        isOpen={isAddCoursesOpen}
        onClose={handleAddCoursesClose}
        semester={selectedSemester}
      />
    </DashboardLayout>
  );
};

export default StudentCoursesPage;
