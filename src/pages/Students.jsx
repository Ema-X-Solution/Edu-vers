import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Filter, MoreVertical } from 'lucide-react';

const studentsData = [
  { id: 'STU001', name: 'John Doe', email: 'john@example.com', major: 'Computer Science', status: 'Active' },
  { id: 'STU002', name: 'Jane Smith', email: 'jane@example.com', major: 'Business Admin', status: 'Active' },
  { id: 'STU003', name: 'Alice Johnson', email: 'alice@example.com', major: 'Engineering', status: 'Inactive' },
  { id: 'STU004', name: 'Bob Brown', email: 'bob@example.com', major: 'Mathematics', status: 'Active' },
  { id: 'STU005', name: 'Charlie Davis', email: 'charlie@example.com', major: 'Physics', status: 'Active' },
];

const Students = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Students</h1>
          <p className="text-gray-text text-sm mt-1">Manage all registered students and their academic records.</p>
        </div>
        <button className="bg-main text-white px-4 py-2 rounded-lg font-medium hover:bg-main-hover transition-colors text-sm">
          + Add New Student
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-main transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-dark-blue hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-gray-text uppercase tracking-wider">Student ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-text uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-text uppercase tracking-wider">Email Address</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-text uppercase tracking-wider">Major</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-text uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-text uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student) => (
                <tr key={student.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-dark-blue">{student.id}</td>
                  <td className="py-4 px-6 text-sm text-dark-blue">{student.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-text">{student.email}</td>
                  <td className="py-4 px-6 text-sm text-gray-text">{student.major}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-percentage-up/10 text-percentage-up' : 'bg-percentage-down/10 text-percentage-down'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right">
                    <button className="text-gray-400 hover:text-dark-blue transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-sm text-gray-text">
          <p>Showing 1 to 5 of 12,450 entries</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 bg-main text-white rounded">1</button>
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-gray-50">3</button>
            <span>...</span>
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;
