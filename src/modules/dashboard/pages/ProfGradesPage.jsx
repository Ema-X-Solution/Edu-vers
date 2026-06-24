import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/layouts';
import { Card, Loader, Button } from '@/shared/ui';
import { Download, Edit2, Check, ChevronDown } from 'lucide-react';
import httpClient from '@/shared/services/httpClient';

const ProfGradesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('FALL');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedGrades, setEditedGrades] = useState({});

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user_info');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const profId = userObj?.userId || userObj?.id || userObj?._id || localStorage.getItem('userId');

        if (!profId) {
          throw new Error('No Professor ID found');
        }

        const res = await httpClient.get(`/grades/gradebook/${profId}`);
        const data = res?.data || res || [];
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching gradebook:', err);
        setCourses(getMockGradebook());
      } finally {
        setLoading(false);
      }
    };
    fetchGradebook();
  }, []);

  const filteredCourses = courses.filter(c => c.semester === selectedSemester);

  useEffect(() => {
    if (filteredCourses.length > 0) {
      if (!filteredCourses.find(c => c.courseId === selectedCourseId)) {
        setSelectedCourseId(filteredCourses[0].courseId);
      }
    } else {
      setSelectedCourseId('');
    }
  }, [filteredCourses, selectedCourseId]);

  const currentCourse = filteredCourses.find(c => c.courseId === selectedCourseId);
  const students = currentCourse?.students || [];

  const handleEditChange = (studentId, field, value) => {
    setEditedGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsEditMode(false);
      
      if (Object.keys(editedGrades).length === 0) return;
      
      setLoading(true);

      const payload = [];
      Object.keys(editedGrades).forEach(studentId => {
        const student = students.find(s => s.studentId === studentId);
        if (student) {
          const newMarks = { ...student.marks, ...editedGrades[studentId] };
          payload.push({
            studentAcademicId: student.academicId || student.studentId,
            midterm: Number(newMarks.midterm) || 0,
            final: Number(newMarks.final) || 0,
            practical: Number(newMarks.practical) || 0,
            assignment1: Number(newMarks.assignment1) || 0,
            assignment2: Number(newMarks.assignment2) || 0,
          });
        }
      });

      if (payload.length > 0) {
        await httpClient.post(`/grades/grade-upload/${selectedCourseId}`, payload);
      }
      
      // Update local state to reflect changes
      const updatedCourses = courses.map(course => {
        if (course.courseId === selectedCourseId) {
          const updatedStudents = course.students.map(student => {
            if (editedGrades[student.studentId]) {
              return {
                ...student,
                marks: {
                  ...student.marks,
                  ...editedGrades[student.studentId]
                }
              };
            }
            return student;
          });
          return { ...course, students: updatedStudents };
        }
        return course;
      });
      setCourses(updatedCourses);
      setEditedGrades({});
    } catch (err) {
      console.error('Error saving grades:', err);
      setError('Failed to save grades.');
    } finally {
      setLoading(false);
    }
  };

  // Utility to determine overall grade color
  const getOverallStyle = (score) => {
    const num = parseFloat(score);
    if (isNaN(num)) return 'text-gray-500 bg-gray-100';
    if (num >= 85) return 'text-green-600 bg-green-50';
    if (num >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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

  if (error && courses.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-500 font-bold text-lg">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto pb-10 pt-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">Grades management</h1>
          <p className="text-gray-500 font-medium">Manage Students Degrees</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Top Controls */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 bg-white">
            <div className="flex-1">
              <div className="relative mb-2">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="appearance-none bg-transparent text-2xl font-black text-dark-blue cursor-pointer focus:outline-none focus:ring-0 w-auto pr-8"
                  style={{ backgroundImage: 'none' }}
                >
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map(c => (
                      <option key={c.courseId} value={c.courseId} className="text-base font-medium">
                        {c.courseName} - {c.courseCode}
                      </option>
                    ))
                  ) : (
                    <option value="">No courses found</option>
                  )}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-[#0D9488] pointer-events-none" size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-400 mb-6">
                Academic Year {currentCourse?.academicYear || '-'}
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Semester:</span>
                <div className="relative">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="appearance-none bg-[#F8FAFC] border border-gray-200 text-sm font-bold text-dark-blue py-1.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-[#0D9488] transition-all cursor-pointer"
                  >
                    <option value="FALL">Fall</option>
                    <option value="SPRING">Spring</option>
                    <option value="SUMMER">Summer</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold transition-colors">
                <Download size={16} /> Export CSV
              </button>
              
              {isEditMode ? (
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 h-10 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors shadow-sm shadow-green-500/20"
                >
                  <Check size={16} /> Save
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors shadow-sm shadow-teal-500/20"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider w-[25%] border-r border-gray-100">STUDENT NAME</th>
                  <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider w-[10%] border-r border-gray-100">ID</th>
                  <th className="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider w-[10%] text-center border-r border-gray-100">OVERALL</th>
                  <th className="py-3 px-6 w-[13.75%] text-center border-r border-gray-100">
                    <p className="text-[11px] font-black text-dark-blue uppercase tracking-wider">ASSIGNMENT 1</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">Due Oct 12 • 10 pts</p>
                  </th>
                  <th className="py-3 px-6 w-[13.75%] text-center border-r border-gray-100">
                    <p className="text-[11px] font-black text-dark-blue uppercase tracking-wider">MIDTERM</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">Due Oct 20 • 100 pts</p>
                  </th>
                  <th className="py-3 px-6 w-[11%] text-center border-r border-gray-100">
                    <p className="text-[11px] font-black text-dark-blue uppercase tracking-wider">ASSIGNMENT 2</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">Due Oct 22 • 20 pts</p>
                  </th>
                  <th className="py-3 px-6 w-[11%] text-center border-r border-gray-100">
                    <p className="text-[11px] font-black text-dark-blue uppercase tracking-wider">PRACTICAL</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">Due Oct 25 • 20 pts</p>
                  </th>
                  <th className="py-3 px-6 w-[11%] text-center">
                    <p className="text-[11px] font-black text-dark-blue uppercase tracking-wider">FINAL</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">Due Nov 01 • 100 pts</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const marks = student.marks || {};
                  
                  // Calculate overall roughly based on simple sum out of 100
                  const currentOverall = 
                    (parseInt(marks.midterm || 0)) + 
                    (parseInt(marks.practical || 0)) + 
                    (parseInt(marks.final || 0)) + 
                    (parseInt(marks.assignment1 || 0)) + 
                    (parseInt(marks.assignment2 || 0));
                    
                  return (
                    <tr key={student.studentId || idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6 border-r border-gray-100">
                        <p className="text-sm font-bold text-dark-blue">{student.studentName}</p>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-500 border-r border-gray-100">
                        {student.academicId || student.studentId}
                      </td>
                      <td className="py-4 px-6 text-center border-r border-gray-100">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wide ${getOverallStyle(currentOverall)}`}>
                          {currentOverall}%
                        </span>
                      </td>
                      
                      {/* Grade Cells */}
                      {['assignment1', 'midterm', 'assignment2', 'practical', 'final'].map((field) => {
                        const value = editedGrades[student.studentId]?.[field] ?? marks[field] ?? '--';
                        const isMissing = value === 'MISSING';
                        const isLate = value === 'LATE';
                        const isExc = value === 'EXC';
                        const isDash = value === '--' || value === '';

                        return (
                          <td key={field} className="py-4 px-6 text-center border-r border-gray-100 last:border-0 relative group">
                            {isEditMode ? (
                              <input 
                                type="text" 
                                value={isDash ? '' : value}
                                onChange={(e) => handleEditChange(student.studentId, field, e.target.value)}
                                className="w-16 h-8 text-center text-sm font-bold text-dark-blue border border-gray-200 rounded focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] outline-none"
                              />
                            ) : (
                              <div className="flex justify-center items-center">
                                {isMissing ? (
                                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">MISSING</span>
                                ) : isLate ? (
                                  <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-black rounded uppercase tracking-wider">LATE</span>
                                ) : isExc ? (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-black rounded uppercase tracking-wider">EXC</span>
                                ) : isDash ? (
                                  <span className="text-gray-300 font-bold">--</span>
                                ) : (
                                  <span className="text-sm font-bold text-slate-700">{value}</span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-gray-400 font-semibold">
                      No students enrolled in this course.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

// Fallback Mock Data matching API structure
const getMockGradebook = () => [
  {
    courseId: 'mock-course-1',
    courseName: 'Intro to Computer Science',
    courseCode: 'CS101',
    academicYear: '1',
    semester: 'FALL',
    students: [
      {
        studentId: 'stu-1',
        studentName: 'Ayman Abdullah',
        academicId: '42022034',
        marks: {
          assignment1: 10,
          assignment2: 10,
          midterm: 20,
          final: 38,
          practical: 20
        }
      }
    ]
  }
];

export default ProfGradesPage;
