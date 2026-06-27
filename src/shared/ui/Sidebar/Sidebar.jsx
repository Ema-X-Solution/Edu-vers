import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Landmark, BookOpen, Star, LogOut, GraduationCap, X, Users2, User } from 'lucide-react';
import { ROUTES } from '@/shared/constants';

const Sidebar = ({ isOpen = false, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    navigate(ROUTES.LOGIN);
  };

  // ✅ Determine the navigation items based on the actual user role stored after login
  // NOT from the URL (URL-based detection caused Admins on /dashboard/students to switch to student nav)
  const [userInfo, setUserInfo] = React.useState({ fullName: 'Edu-System(Admin 1)', userRole: 'Admin' });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) {
        setUserInfo(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to parse user_info', err);
    }
  }, []);

  const role = (userInfo.userRole || '').toLowerCase();
  const isStudentFlow = role === 'student';
  const isProfFlow    = role === 'professor' || role === 'prof';

  const adminNavItems = [
    { name: 'Students',       path: '/dashboard/students',    icon: Users },
    { name: 'Academic Staff', path: '/dashboard/staff',       icon: Landmark },
    { name: 'Courses',        path: '/dashboard/courses',     icon: BookOpen },
    { name: 'Communities',    path: '/dashboard/communities', icon: Users2 },
  ];

  const studentNavItems = [
    { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
    { name: 'Courses',   path: '/student-courses',   icon: BookOpen },
    { name: 'Communities', path: '/student-communities', icon: Users },
    { name: 'Profile',   path: '/student-profile',   icon: User },
  ];

  const profNavItems = [
    { name: 'Tasks management', path: '/prof-dashboard', icon: Landmark },
    { name: 'Grades management', path: '/prof-grades', icon: Star },
    { name: 'Profile', path: '/prof-profile', icon: User },
  ];


  const navItems = isStudentFlow
    ? studentNavItems
    : isProfFlow
      ? profNavItems
      : adminNavItems;

  const initials = userInfo.fullName
    ? userInfo.fullName.substring(0, 2).toUpperCase()
    : 'U';


  return (
    <aside
      className={`
        w-64 bg-white border-r border-[#E2E8F0] h-screen flex flex-col fixed left-0 top-0 z-20
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      {/* Brand logo section */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#E2E8F0]/80 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(13,148,136,0.08)] border border-[#E2E8F0]">
            <GraduationCap className="text-[#0D9488]" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-[#0F172A] tracking-tight leading-none">EduVers</span>
            <span className="text-[9px] font-bold text-[#94A3B8] tracking-widest mt-1">MANAGEMENT</span>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setIsOpen?.(false)}
          className="md:hidden text-gray-400 hover:text-dark-blue transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard' || item.path === '/student-dashboard'}
            onClick={() => setIsOpen?.(false)}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer
              ${isActive
                ? 'bg-[#EFF2FC] text-[#0D9488] shadow-sm'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0D9488]'}
            `}
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Card */}
      <div className="p-4 border-t border-[#E2E8F0]/80 shrink-0">
        <div
          onClick={handleLogout}
          className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-red-50 hover:border-red-100 group transition-colors duration-200 cursor-pointer"
          title="Log out"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E2E8F0] overflow-hidden flex items-center justify-center font-bold text-xs text-[#475569] group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0F172A] leading-tight truncate w-24 group-hover:text-red-700 transition-colors">
                {userInfo.fullName}
              </span>
              <span className="text-[10px] font-medium text-[#64748B] truncate w-24 group-hover:text-red-500 transition-colors">
                {userInfo.userRole}
              </span>
            </div>
          </div>
          <LogOut size={16} className="text-[#64748B] group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
