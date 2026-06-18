import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

/**
 * Action cell for staff row.
 */
const StaffActionsCell = ({ staff, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
        aria-label="Staff actions"
      >
        <MoreVertical size={18} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-100">
          <div className="py-1">
            <button
              onClick={() => { setIsOpen(false); onEdit?.(staff); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Edit2 size={14} className="mr-2" />
              Edit
            </button>
            <button
              onClick={() => { setIsOpen(false); onDelete?.(staff); }}
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

export default StaffActionsCell;
