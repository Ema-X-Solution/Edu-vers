import React, { useState } from 'react';
import { Sidebar, Topbar } from '@/shared/ui';

const DashboardLayout = ({ children, onSearchChange, searchPlaceholder, topbarActions }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-bg-app min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#090D16]/50 backdrop-blur-sm z-10 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full transition-all duration-300 overflow-x-hidden">
        <Topbar
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          actions={topbarActions}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden animate-fade-in w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

