import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Users, UserSquare2, BookOpen, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, isPositive }) => (
  <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
    <div>
      <p className="text-gray-text text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-dark-blue">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-percentage-up' : 'text-percentage-down'}`}>
          {isPositive ? '↑' : '↓'} {trend} this month
        </p>
      )}
    </div>
    <div className="w-12 h-12 rounded-full bg-lighter-main flex items-center justify-center text-main">
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Dashboard Overview</h1>
          <p className="text-gray-text text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button className="bg-main text-white px-4 py-2 rounded-lg font-medium hover:bg-main-hover transition-colors text-sm">
          + Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Students" value="12,450" icon={Users} trend="12.5%" isPositive={true} />
        <StatCard title="Academic Staff" value="150" icon={UserSquare2} trend="2.4%" isPositive={true} />
        <StatCard title="Total Courses" value="64" icon={BookOpen} trend="0%" isPositive={true} />
        <StatCard title="Total Revenue" value="$3,250" icon={DollarSign} trend="4.2%" isPositive={false} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] min-h-[400px] flex items-center justify-center">
        <p className="text-gray-400">Chart Visualization Placeholder</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
