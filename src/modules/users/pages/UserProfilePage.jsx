import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Card, Loader, Button } from '@/shared/ui';
import { fetchUserProfile, fetchCurrentGrades, fetchAcademicRecords } from '../services/usersService';
import { User, Mail, Phone, MapPin, Building, Calendar, Hash, ArrowLeft, BookOpen, Star, Clock, CheckCircle, GraduationCap, Edit2, Trash2, Loader2, ChevronDown } from 'lucide-react';

const UserProfilePage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState('Enrolled Courses');

  // Grades state
  const [selectedSemester, setSelectedSemester] = useState('FALL');
  const [gradesData, setGradesData] = useState([]);
  const [isGradesLoading, setIsGradesLoading] = useState(false);

  // Academic Summary state
  const [academicRecords, setAcademicRecords] = useState([]);
  const [isRecordsLoading, setIsRecordsLoading] = useState(false);

  useEffect(() => {
    let activeId = paramId;
    let loggedInId = null;
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      loggedInId = userInfo?.userId || userInfo?._id;
    } catch (err) {}

    if (!activeId) {
      activeId = loggedInId;
    }
    
    setCurrentId(activeId);
    setIsOwnProfile(activeId === loggedInId);

    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await fetchUserProfile(activeId);
        const data = res?.data || res;
        
        setProfile(data?.profile || data?.user || data);
        setStats(data?.statistics || null);
        setCourses(data?.enrolledCourses || data?.courses || []);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    if (activeId) {
      loadProfile();
    } else {
      setLoading(false);
      setError('No user ID found.');
    }
  }, [paramId]);

  useEffect(() => {
    if (activeTab === 'Grades') {
      const loadGrades = async () => {
        try {
          setIsGradesLoading(true);
          const res = await fetchCurrentGrades(selectedSemester);
          setGradesData(res?.data || res || []);
        } catch (err) {
          console.error('Failed to fetch grades', err);
        } finally {
          setIsGradesLoading(false);
        }
      };
      loadGrades();
    }
  }, [activeTab, selectedSemester]);

  useEffect(() => {
    if (activeTab === 'Academic Summary' && currentId) {
      const loadRecords = async () => {
        try {
          setIsRecordsLoading(true);
          const res = await fetchAcademicRecords(currentId);
          setAcademicRecords(res?.data || res || []);
        } catch (err) {
          console.error('Failed to fetch academic records', err);
        } finally {
          setIsRecordsLoading(false);
        }
      };
      loadRecords();
    }
  }, [activeTab, currentId]);

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
          {paramId && (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold transition-colors">
                <Trash2 size={16} /> Delete {isStudent ? 'Student' : 'Staff'}
              </button>
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors">
                <Edit2 size={16} /> Edit {isStudent ? 'Student' : 'Staff'}
              </button>
            </div>
          )}
        </div>

        {/* Top Section: Info & Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Left: Info Card — full width for staff/professor */}
          <Card className={`${isStudent ? 'xl:col-span-2' : 'xl:col-span-3'} p-6 flex flex-col md:flex-row gap-6 border border-gray-200 shadow-sm rounded-2xl relative overflow-hidden`}>
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
              
              {isStudent ? (
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-6">
                  <GraduationCap size={18} className="text-gray-400" />
                  <span>Senior Year (Year {academicYear})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-6">
                  <Building size={18} className="text-gray-400" />
                  <span>{profile.role || 'Staff Member'}</span>
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

          {/* Right: Stats Grid — only for students */}
          {isStudent && (
            <div className="xl:col-span-1 grid grid-cols-2 gap-4">
              {statsCards.map((stat, idx) => (
                <div key={idx} className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center ${stat.bg}`}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-black mb-1 ${stat.text}`}>{stat.value}</h3>
                {stat.sub && <p className="text-[10px] font-semibold text-gray-400">{stat.sub}</p>}
              </div>
            ))}
            </div>
          )}

        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
          {/* Tabs Header */}
          <div className="flex items-center gap-8 px-6 border-b border-gray-100 bg-white">
            {[
              isStudent ? 'Enrolled Courses' : 'Taught Courses', 
              (isStudent && isOwnProfile) ? 'Grades' : null, 
              (isStudent && isOwnProfile) ? 'Academic Summary' : null
            ].filter(Boolean).map((tab) => (
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
            
            {(activeTab === 'Enrolled Courses' || activeTab === 'Taught Courses') && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={20} className="text-[#0D9488]" />
                  <h3 className="text-lg font-black text-dark-blue">{activeTab}</h3>
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
                                onClick={() => navigate(profile.studentId ? `/student-courses/${course._id || course.id || course.code}` : `/courses/${course._id || course.id || course.code}`)}
                                className="text-sm font-bold text-dark-blue cursor-pointer group-hover:text-[#0D9488] transition-colors"
                              >
                                {course.courseName || course.name}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold text-gray-500">{course.code}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-gray-600">{course.doctor || course.department || 'N/A'}</td>
                            <td className="py-4 px-4 text-sm font-semibold text-gray-600">{course.credits || course.creditHours}</td>
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-[#0D9488]" />
                    <h3 className="text-lg font-black text-dark-blue">Current Enrolled Courses</h3>
                  </div>
                  
                  {/* Semester Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="appearance-none bg-[#F8FAFC] border border-gray-200 text-sm font-bold text-dark-blue py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all cursor-pointer"
                    >
                      <option value="FALL">Fall Semester</option>
                      <option value="SPRING">Spring Semester</option>
                      <option value="SUMMER">Summer Semester</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-gray-100 relative">
                  {isGradesLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <Loader2 size={32} className="text-[#0D9488] animate-spin" />
                    </div>
                  )}
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/30">
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">COURSE NAME</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">MIDTERM</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">PRACTICAL</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">FINAL</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">ASSIGNMENT 1</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">ASSIGNMENT 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradesData && gradesData.length > 0 ? (
                        gradesData.map((gradeInfo, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue">
                              {gradeInfo.courseName}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              {gradeInfo.marks?.midterm ?? '--'}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              {gradeInfo.marks?.practical ?? '--'}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              {gradeInfo.marks?.final ?? '--'}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              {gradeInfo.marks?.assignment1 ?? '--'}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              {gradeInfo.marks?.assignment2 ?? '--'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-10 text-center text-gray-400 font-semibold">No grades available for {selectedSemester}.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Academic Summary' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={20} className="text-[#0D9488]" />
                  <h3 className="text-lg font-black text-dark-blue">Academic Records Summary</h3>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-gray-100 relative">
                  {isRecordsLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <Loader2 size={32} className="text-[#0D9488] animate-spin" />
                    </div>
                  )}
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/30">
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">COURSE NAME</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">CODE</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">CREDIT HOURS</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">SCORE</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">GRADE</th>
                        <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">SEMESTER / YEAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {academicRecords && academicRecords.length > 0 ? (
                        academicRecords.map((record, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue">
                              {record.name}
                              {record.isSummer && <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Summer</span>}
                            </td>
                            <td className="py-5 px-6 text-sm font-semibold text-gray-500">
                              {record.code}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              {record.creditHours}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              {record.score}
                            </td>
                            <td className="py-5 px-6 text-sm font-bold text-dark-blue text-center">
                              <span className={`px-2 py-1 rounded font-bold ${
                                record.grade?.includes('A') ? 'bg-green-100 text-green-700' :
                                record.grade?.includes('B') ? 'bg-blue-100 text-blue-700' :
                                record.grade?.includes('C') ? 'bg-yellow-100 text-yellow-700' :
                                record.grade?.includes('F') ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {record.grade}
                              </span>
                            </td>
                            <td className="py-5 px-6 text-sm font-semibold text-gray-500 text-center">
                              {record.semester} - Y{record.academicYear}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-10 text-center text-gray-400 font-semibold">
                            {!isRecordsLoading ? 'No academic records available.' : ''}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
