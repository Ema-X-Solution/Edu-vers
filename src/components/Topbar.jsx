import React from 'react';
import { Search, Bell } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-20 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for something..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-sm outline-none focus:border-main focus:bg-white transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-gray-text hover:text-dark-blue transition-colors">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=15B392&color=fff"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-dark-blue">Admin User</p>
            <p className="text-xs text-gray-text">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
