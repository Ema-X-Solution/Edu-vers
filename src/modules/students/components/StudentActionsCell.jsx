import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * A single row in the students table.
 * Kept small and focused — renders one student, nothing else.
 */
const StudentActionsCell = ({ student, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-dark-blue transition-colors cursor-pointer p-1 rounded"
        aria-label="Student actions"
      >
        <MoreVertical size={18} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50 border border-gray-100">
          <div className="py-1">
            <button
              onClick={() => { setIsOpen(false); navigate(`/users/profile/${student._id || student.id}`); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Eye size={14} className="mr-2" />
              View Details
            </button>
            <button
              onClick={() => { setIsOpen(false); onEdit?.(student); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Edit2 size={14} className="mr-2" />
              Edit
            </button>
            <button
              onClick={() => { setIsOpen(false); onDelete?.(student); }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentActionsCell;
