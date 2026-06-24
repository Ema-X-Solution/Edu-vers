import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/layouts';
import { Card, Loader, Button } from '@/shared/ui';
import { Download, Edit2, Check, ChevronDown } from 'lucide-react';
import httpClient from '@/shared/services/httpClient';

const ProfGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedGrades, setEditedGrades] = useState({});

  const [activeFilter, setActiveFilter] = useState('All Students');
  const filters = ['All Students', 'Section A', 'Section B', 'At Risk (<40%)'];

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user_info');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const profId = userObj?.userId || userObj?.id || userObj?._id || localStorage.getItem('userId');

        if (!profId) {
          throw new Error('No Professor ID found');
        }

        const res = await httpClient.get(`/grades/gradebook/${profId}`);
        // Assume API returns array of student grades or an object containing them
        const data = res?.data?.grades || res?.data || res || [];
        setGrades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching grades:', err);
        // Fallback to mock data if API fails to allow UI preview
        setGrades(getMockGrades());
        // setError('Failed to load grades.'); // Uncomment to block UI on error
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const handleEditChange = (studentId, field, value) => {
    setEditedGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setIsEditMode(false);
    // Here we would typically send editedGrades to a save endpoint
    console.log('Saved grades:', editedGrades);
    // Update local state to reflect changes
    const updatedGrades = grades.map(g => {
      if (editedGrades[g.studentId]) {
        return { ...g, ...editedGrades[g.studentId] };
      }
      return g;
    });
    setGrades(updatedGrades);
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

  if (error && grades.length === 0) {
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
              <div className="flex items-center gap-2 cursor-pointer mb-6 group inline-flex">
                <h2 className="text-2xl font-black text-dark-blue group-hover:text-[#0D9488] transition-colors">Calculus I - Section 101</h2>
                <ChevronDown className="text-gray-400 group-hover:text-[#0D9488] transition-colors mt-1" size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-400 mb-4">Fall 2024 | Semester 1</p>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider mr-2">Filter By:</span>
                {filters.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      activeFilter === f 
                        ? (f.includes('Risk') ? 'bg-red-50 text-red-600' : 'bg-[#0D9488] text-white')
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
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
                {grades.map((grade, idx) => (
                  <tr key={grade.studentId || idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6 border-r border-gray-100">
                      <p className="text-sm font-bold text-dark-blue">{grade.name}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">{grade.email}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-500 border-r border-gray-100">
                      {grade.studentId}
                    </td>
                    <td className="py-4 px-6 text-center border-r border-gray-100">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wide ${getOverallStyle(grade.overall)}`}>
                        {grade.overall}
                      </span>
                    </td>
                    
                    {/* Grade Cells */}
                    {['assignment1', 'midterm', 'assignment2', 'practical', 'final'].map((field) => {
                      const value = editedGrades[grade.studentId]?.[field] ?? grade[field];
                      const isMissing = value === 'MISSING';
                      const isLate = value === 'LATE';
                      const isExc = value === 'EXC';
                      const isDash = value === '--' || !value;

                      return (
                        <td key={field} className="py-4 px-6 text-center border-r border-gray-100 last:border-0 relative group">
                          {isEditMode ? (
                            <input 
                              type="text" 
                              value={value === '--' ? '' : value}
                              onChange={(e) => handleEditChange(grade.studentId, field, e.target.value)}
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
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

// Fallback Mock Data matching the screenshot exactly
const getMockGrades = () => [
  { studentId: '10234', name: 'Alice Johnson', email: 'alice.j@uni.edu', overall: '92% A', assignment1: '9', midterm: '92', assignment2: '18', practical: '19', final: '--' },
  { studentId: '10235', name: 'Bob Smith', email: 'bob.smith@uni.edu', overall: '78% C+', assignment1: '7', midterm: '75', assignment2: 'LATE', practical: '15', final: '--' },
  { studentId: '10236', name: 'Charlie Davis', email: 'charlie.d@uni.edu', overall: '45% F', assignment1: 'MISSING', midterm: '60', assignment2: '12', practical: '10', final: '--' },
  { studentId: '10237', name: 'Dana Lee', email: 'dana.lee@uni.edu', overall: '88% B+', assignment1: '10', midterm: '85', assignment2: '19', practical: '18', final: '--' },
  { studentId: '10238', name: 'Evan Wright', email: 'evan.w@uni.edu', overall: '65% D', assignment1: '5', midterm: '60', assignment2: 'EXC', practical: '--', final: '--' },
];

export default ProfGradesPage;
