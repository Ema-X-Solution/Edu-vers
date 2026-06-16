import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { MoreVertical, Trash, Edit, Eye } from 'lucide-react';

const CourseActionsCell = ({ course, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group flex justify-end" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-dark-blue transition-colors cursor-pointer p-1 rounded"
        aria-label="Course actions"
      >
        <MoreVertical size={18} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
          <button 
            onClick={() => { setIsOpen(false); navigate(`${ROUTES.COURSES}/${course._id}`); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Eye size={14} className="text-green-500" />
            View
          </button>
          <button 
            onClick={() => { setIsOpen(false); onEdit(course); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Edit size={14} className="text-blue-500" />
            Edit
          </button>
          <button 
            onClick={() => { setIsOpen(false); onDelete(course); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Trash size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseActionsCell;
