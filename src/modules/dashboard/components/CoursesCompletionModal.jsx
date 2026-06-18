import React from 'react';
import { Modal } from '@/shared/ui';

// Mock expanded data to show scrolling in the modal
const allCourses = [
  { name: 'Introduction to computer science', grade: 96, color: 'bg-teal-500' },
  { name: 'Data Mining', grade: 85, color: 'bg-orange-500' },
  { name: 'Physics M107', grade: 80, color: 'bg-indigo-900' },
  { name: 'Machine Learning', grade: 76, color: 'bg-purple-500' },
  { name: 'Introduction to computer science', grade: 96, color: 'bg-teal-500' },
  { name: 'Data Mining', grade: 85, color: 'bg-orange-500' },
  { name: 'Physics M107', grade: 80, color: 'bg-indigo-900' },
  { name: 'Machine Learning', grade: 76, color: 'bg-purple-500' },
  { name: 'Introduction to computer science', grade: 96, color: 'bg-teal-500' },
  { name: 'Data Mining', grade: 85, color: 'bg-orange-500' },
  { name: 'Physics M107', grade: 80, color: 'bg-indigo-900' },
  { name: 'Physics M107', grade: 80, color: 'bg-indigo-900' },
];

const CoursesCompletionModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Courses completion" size="md">
      <div className="flex flex-col gap-5">
        {allCourses.map((course, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-dark-blue">{course.name}</span>
              <span className="text-gray-400">{course.grade}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${course.color}`} 
                style={{ width: `${course.grade}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CoursesCompletionModal;
