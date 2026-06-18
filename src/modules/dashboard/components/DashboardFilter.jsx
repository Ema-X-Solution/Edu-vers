import React from 'react';
import { Card } from '@/shared/ui';

const DashboardFilter = () => {
  return (
    <Card className="p-5 flex flex-col gap-4 h-full justify-between">
      <h2 className="text-lg font-bold text-dark-blue mb-2 text-center">Filter</h2>
      
      <div>
        <label className="block text-xs font-bold text-gray-text mb-1.5 lowercase">years filter</label>
        <select className="w-full bg-bg-app border-none text-sm text-gray-text px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-main/20 cursor-pointer shadow-sm">
          <option value="First Year">First Year</option>
          <option value="second Year">second Year</option>
          <option value="third Year">third Year</option>
          <option value="fourth Year">fourth Year</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-text mb-1.5 lowercase">semesters filter</label>
        <select className="w-full bg-bg-app border-none text-sm text-gray-text px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-main/20 cursor-pointer shadow-sm">
          <option value="First Semester">First Semester</option>
          <option value="second Semester">second Semester</option>
          <option value="third Semester">third Semester</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-text mb-1.5 lowercase">subjects filter</label>
        <select className="w-full bg-bg-app border-none text-sm text-gray-text px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-main/20 cursor-pointer shadow-sm">
          <option value="Physics M107">Physics M107</option>
          <option value="Data Mining">Data Mining</option>
          <option value="Machine Learning">Machine Learning</option>
        </select>
      </div>
    </Card>
  );
};

export default DashboardFilter;
