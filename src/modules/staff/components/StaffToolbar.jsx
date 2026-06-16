import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Select } from '@/shared/ui';
import { STAFF_STATUS_OPTIONS } from '../constants/staffConstants.jsx';

/**
 * Toolbar for the staff table — search input + status filter.
 */
const StaffToolbar = ({ search, statusFilter, onSearch, onStatusFilter }) => (
  <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
    <div className="relative w-full sm:w-64">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name, email, ID…"
        className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-main transition-colors"
      />
    </div>

    <div className="flex items-center gap-3 w-full sm:w-auto">
      <Filter size={16} className="text-gray-400 shrink-0" />
      <Select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value)}
        options={STAFF_STATUS_OPTIONS}
        className="w-40"
      />
    </div>
  </div>
);

export default StaffToolbar;
