import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Briefcase, UserCheck, ChevronDown, MoreHorizontal, Eye } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts';

const DashboardPage = () => {
  const [selectedRange, setSelectedRange] = useState('Last 6 Months');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');  

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) {
        const info = JSON.parse(stored);
        // Extract first name for a friendly greeting
        setUserName(info.fullName?.split(' ')[0] || '');
      }
    } catch {}
  }, []);

  // Stat Card configurations exactly matching Figma mockup
  const stats = [
    {
      title: 'Total Students',
      value: '12,450',
      trend: '+12%',
      isPositive: true,
      icon: Users,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
    {
      title: 'Total Courses',
      value: '156',
      trend: '+4%',
      isPositive: true,
      icon: BookOpen,
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
    },
    {
      title: 'Total Doctors',
      value: '84',
      trend: '0%',
      isNeutral: true,
      icon: Briefcase,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
    },
    {
      title: 'Registered Courses',
      value: '3,200',
      trend: '+18%',
      isPositive: true,
      icon: UserCheck,
      iconBg: '#FAF5FF',
      iconColor: '#9333EA',
    },
  ];

  // Course distribution data exactly matching Figma mockup
  const courses = [
    { name: 'Computer Science', percentage: 45, color: '#0D9488' },
    { name: 'Business Admin', percentage: 30, color: '#0ea5e9' },
    { name: 'Medical Studies', percentage: 15, color: '#1e3a8a' },
    { name: 'Engineering', percentage: 10, color: '#8b5cf6' },
  ];

  // Fake chart datasets dynamically updated based on the range filter selection
  const chartDatasets = {
    'Last 3 Months': [
      { month: 'APR', height: '50%', active: false },
      { month: 'MAY', height: '75%', active: false },
      { month: 'JUN', height: '95%', active: true }
    ],
    'Last 6 Months': [
      { month: 'JAN', height: '55%', active: false },
      { month: 'FEB', height: '40%', active: false },
      { month: 'MAR', height: '80%', active: true },
      { month: 'APR', height: '60%', active: false },
      { month: 'MAY', height: '70%', active: false },
      { month: 'JUN', height: '90%', active: false }
    ],
    'Last Year': [
      { month: 'JUL', height: '35%', active: false },
      { month: 'AUG', height: '45%', active: false },
      { month: 'SEP', height: '50%', active: false },
      { month: 'OCT', height: '65%', active: false },
      { month: 'NOV', height: '70%', active: false },
      { month: 'DEC', height: '85%', active: true },
      { month: 'JAN', height: '60%', active: false },
      { month: 'FEB', height: '45%', active: false },
      { month: 'MAR', height: '75%', active: false },
      { month: 'APR', height: '65%', active: false },
      { month: 'MAY', height: '70%', active: false },
      { month: 'JUN', height: '95%', active: false }
    ]
  };

  const currentChartData = chartDatasets[selectedRange];

  return (
    <DashboardLayout>
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Dashboard Overview</h1>
          <p className="text-[#64748B] text-xs font-semibold mt-1">
            Good morning{userName ? `, ${userName}` : ''} — here is what's happening today.
          </p>
        </div>
      </div>

      {/* Stats grid matching Figma color themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                {/* Icon Backdrop */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: stat.iconBg }}
                >
                  <Icon size={18} style={{ color: stat.iconColor }} />
                </div>
                {/* Trend Badge */}
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    stat.isNeutral
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-green-50 text-[#16A34A]'
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">
                  {stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Section: Bar Chart & Distribution list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Student Enrollment Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Student Enrollment</h3>
            
            {/* Interactive Dropdown Wrapper */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#475569] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {selectedRange} <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 w-36 z-40 animate-fade-in">
                    {Object.keys(chartDatasets).map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedRange(range);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[11px] font-bold cursor-pointer transition-colors ${
                          selectedRange === range
                            ? 'bg-[#EFF2FC] text-[#0D9488]'
                            : 'text-[#475569] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="flex-1 flex items-end justify-between px-4 h-[200px] border-b border-gray-100 pb-2">
            {currentChartData.map((bar, index) => (
              <div key={index} className="flex flex-col items-center gap-3 w-[12%]">
                <div
                  className="w-full rounded-t-xl transition-all duration-300 relative group cursor-pointer"
                  style={{
                    height: bar.height,
                    backgroundColor: bar.active ? '#0D9488' : '#CCFBF1',
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                    {bar.height.replace('%', 'k')} Students
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-[#94A3B8] tracking-wider">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Distribution list */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] mb-6">Course Distribution</h3>
            <div className="flex flex-col gap-4">
              {courses.map((course, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#475569]">{course.name}</span>
                    <span className="text-[#0F172A]">{course.percentage}%</span>
                  </div>
                  {/* Custom Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${course.percentage}%`,
                        backgroundColor: course.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="text-xs font-extrabold text-[#0D9488] hover:text-[#0F766E] hover:underline transition-colors mt-6 text-center cursor-pointer">
            View All Statistics
          </button>
        </div>

      </div>

      {/* Bottom Section: Recent Students list Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9]">
          <h3 className="text-sm font-extrabold text-[#0F172A]">Recent Students</h3>
          <button className="text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9] text-[10px] font-bold text-[#94A3B8] tracking-wider">
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">STUDENT ID</th>
                <th className="py-4 px-6">EMAIL</th>
                <th className="py-4 px-6">DEPARTMENT</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              <tr className="hover:bg-gray-50/50 transition-colors duration-150 text-xs font-semibold text-[#475569]">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center text-xs">
                    JD
                  </div>
                  <span className="font-extrabold text-[#0F172A]">Jane Doe</span>
                </td>
                <td className="py-4 px-6">#STU-94021</td>
                <td className="py-4 px-6">jane.doe@eduvers.com</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#EFF6FF] text-[#1E40AF]">
                    COMPUTER SCIENCE
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer inline-flex items-center justify-center">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default DashboardPage;
