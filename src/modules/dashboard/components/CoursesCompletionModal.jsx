import React from 'react';
import { Modal } from '@/shared/ui';

const CoursesCompletionModal = ({ isOpen, onClose, courses = [] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Courses completion" size="md">
      <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
        {courses.map((course, idx) => (
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
