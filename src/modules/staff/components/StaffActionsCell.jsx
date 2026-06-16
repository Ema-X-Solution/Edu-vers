import React from 'react';
import { MoreVertical } from 'lucide-react';

/**
 * Action cell for staff row.
 */
const StaffActionsCell = ({ staff, onDelete }) => (
  <div className="relative group">
    <button
      className="text-gray-400 hover:text-dark-blue transition-colors cursor-pointer p-1 rounded"
      aria-label="Staff actions"
    >
      <MoreVertical size={18} />
    </button>
  </div>
);

export default StaffActionsCell;
