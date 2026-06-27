import React, { useEffect, useState } from 'react';
import { Search, Menu } from 'lucide-react';
import AdminSemesterButton from './AdminSemesterButton';

const Topbar = ({ onSearchChange, searchPlaceholder = 'Search for students, courses, documents...', actions, onMenuToggle }) => {
  const [userInfo, setUserInfo] = useState({ fullName: '', userRole: '' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) setUserInfo(JSON.parse(stored));
    } catch {}
  }, []);

  const initials = userInfo.fullName
    ? userInfo.fullName.substring(0, 2).toUpperCase()
    : 'A';

  return (
    <header className="h-16 md:h-20 bg-white border-b border-[#E2E8F0] px-4 md:px-8 flex items-center sticky top-0 z-10 gap-3">
      
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-dark-blue hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Search Input */}
      <div className="flex-1 max-w-[480px] hidden sm:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F9] border border-transparent rounded-full text-xs font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#0D9488] focus:bg-white transition-all duration-200"
          />
        </div>
      </div>
      
      {/* Topbar Actions */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Admin Semester Action */}
        {userInfo.userRole && userInfo.userRole.toLowerCase() === 'admin' && (
          <AdminSemesterButton />
        )}
        
        {/* Optional page-level action buttons */}
        {actions}

        {/* User Avatar Chip */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#E0F2FE] text-[#0D9488] font-bold flex items-center justify-center text-xs border border-[#CCFBF1] shrink-0">
            {initials}
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-xs font-bold text-[#0F172A] truncate max-w-[100px]">{userInfo.fullName}</span>
            <span className="text-[10px] font-medium text-[#94A3B8]">{userInfo.userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
