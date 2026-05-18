import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare2, BookOpen, UserPlus, GraduationCap, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/dashboard/students', icon: Users },
    { name: 'Academic Staff', path: '/dashboard/staff', icon: UserSquare2 },
    { name: 'Courses', path: '/dashboard/courses', icon: BookOpen },
    { name: 'Registration', path: '/dashboard/registration', icon: UserPlus },
    { name: 'Grades', path: '/dashboard/grades', icon: GraduationCap },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] h-screen flex flex-col fixed left-0 top-0">
      <div className="h-20 flex items-center px-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-main flex items-center justify-center text-white font-bold">
            <span className="text-xs">Edu</span>
          </div>
          <span className="text-xl font-bold text-dark-blue">EduVerse</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-main text-white shadow-sm' 
                : 'text-gray-text hover:bg-gray-50 hover:text-dark-blue'}
            `}
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#E2E8F0]">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-text hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
