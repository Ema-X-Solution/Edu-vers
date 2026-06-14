import React from 'react';
import { MoreVertical } from 'lucide-react';

/**
 * A single row in the students table.
 * Kept small and focused — renders one student, nothing else.
 */
const StudentActionsCell = ({ student, onDelete }) => (
  <div className="relative group">
    <button
      className="text-gray-400 hover:text-dark-blue transition-colors cursor-pointer p-1 rounded"
      aria-label="Student actions"
    >
      <MoreVertical size={18} />
    </button>
    {/* Dropdown menu placeholder — can be extended later */}
  </div>
);

export default StudentActionsCell;
