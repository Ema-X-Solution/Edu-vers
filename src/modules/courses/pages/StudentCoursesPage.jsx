import React, { useState } from 'react';
import { Plus, LayoutGrid, Calendar, ChevronDown, Network } from 'lucide-react';
import DashboardLayout from '@/app/layouts/DashboardLayout';
import { Button, Card } from '@/shared/ui';
import StudentCourseCard from '../components/StudentCourseCard';
import StudentScheduleModal from '../components/StudentScheduleModal';

const mockCourses = [
  {
    id: 1,
    code: 'AD-201',
    title: 'Digital Arts & Motion',
    credits: 4,
    description: 'Exploration of contemporary digital art techniques, motion graphics, and visual effects.',
    profName: 'Prof. Kirelos Medhat',
    profDepartment: 'Dept. of Data without analysis',
    profImage: 'https://i.pravatar.cc/150?img=11',
    courseImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    code: 'AD-201',
    title: 'Digital Arts & Motion',
    credits: 4,
    description: 'Exploration of contemporary digital art techniques, motion graphics, and visual effects.',
    profName: 'Prof. Kirelos Medhat',
    profDepartment: 'Dept. of Data without analysis',
    profImage: 'https://i.pravatar.cc/150?img=12',
    courseImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    code: 'AD-201',
    title: 'Digital Arts & Motion',
    credits: 4,
    description: 'Exploration of contemporary digital art techniques, motion graphics, and visual effects.',
    profName: 'Prof. Kirelos Medhat',
    profDepartment: 'Dept. of Data without analysis',
    profImage: 'https://i.pravatar.cc/150?img=13',
    courseImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    code: 'AD-201',
    title: 'Digital Arts & Motion',
    credits: 4,
    description: 'Exploration of contemporary digital art techniques, motion graphics, and visual effects.',
    profName: 'Prof. Kirelos Medhat',
    profDepartment: 'Dept. of Data without analysis',
    profImage: 'https://i.pravatar.cc/150?img=14',
    courseImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop'
  }
];

const StudentCoursesPage = () => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [filterType, setFilterType] = useState('Available');

  const stats = [
    { label: 'REGISTERED', value: '4 Courses', icon: LayoutGrid, bgColor: 'bg-green-50', textColor: 'text-green-500' },
    { label: 'AVAILABLE', value: '124 Courses', icon: LayoutGrid, bgColor: 'bg-blue-50', textColor: 'text-blue-500' },
    { label: 'TOTAL CREDITS', value: '18 Hours', icon: LayoutGrid, bgColor: 'bg-purple-50', textColor: 'text-purple-500' },
    { label: 'TASKS', value: '5 /15', icon: LayoutGrid, bgColor: 'bg-teal-50', textColor: 'text-teal-500' },
  ];

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
            <Button 
              variant="outline" 
              className="flex items-center gap-2 font-bold py-2.5 px-4 bg-white border-gray-200"
              onClick={() => setIsScheduleOpen(true)}
            >
              <Calendar size={18} className="text-gray-500" />
              View My Schedule
            </Button>
            <Button variant="primary" className="flex items-center gap-2 font-bold py-2.5 px-4 bg-teal-500 hover:bg-teal-600">
              <Plus size={18} />
              Add Course
            </Button>
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

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Toggle */}
            <div className="bg-white p-1 rounded-xl flex items-center shadow-sm border border-gray-100">
              <button 
                onClick={() => setFilterType('Available')}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-colors ${filterType === 'Available' ? 'bg-teal-50 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Available
              </button>
              <button 
                onClick={() => setFilterType('Registered')}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-colors ${filterType === 'Registered' ? 'bg-teal-50 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Registered
              </button>
            </div>

            {/* Dropdowns */}
            <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer hover:bg-gray-50">
              Computer science <ChevronDown size={16} className="text-gray-400" />
            </div>
            <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer hover:bg-gray-50">
              Fall 2024 <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>

          <Button variant="outline" className="flex items-center gap-2 bg-white border-gray-100 shadow-sm text-gray-600 hover:text-teal-600 font-bold px-6 py-2.5">
            <Network size={18} className="text-teal-500" />
            COURSES TREE
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockCourses.map((course) => (
            <StudentCourseCard key={course.id} {...course} />
          ))}
        </div>

      </div>

      <StudentScheduleModal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
      />
    </DashboardLayout>
  );
};

export default StudentCoursesPage;
