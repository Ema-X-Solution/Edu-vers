import React from 'react';
import { Sidebar, Topbar } from '@/shared/ui';

const DashboardLayout = ({ children, onSearchChange, searchPlaceholder, topbarActions }) => {
  return (
    <div className="flex bg-bg-app min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          actions={topbarActions}
        />
        <main className="flex-1 p-8 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

