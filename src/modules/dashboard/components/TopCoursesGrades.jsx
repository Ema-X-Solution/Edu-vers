import React, { useState } from 'react';
import { Card } from '@/shared/ui';
import CoursesCompletionModal from './CoursesCompletionModal';

const courses = [
  { name: 'Introduction to computer science', grade: 96, color: 'bg-teal-500' },
  { name: 'Data Mining', grade: 85, color: 'bg-orange-500' },
  { name: 'Physics M107', grade: 80, color: 'bg-indigo-900' },
  { name: 'Machine Learning', grade: 76, color: 'bg-purple-500' },
];

const TopCoursesGrades = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-bold text-dark-blue mb-6">Top courses grades</h2>
        
        <div className="flex-1 space-y-5">
          {courses.map((course, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-dark-blue">{course.name}</span>
                <span className="text-gray-500">{course.grade}%</span>
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

        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-main font-semibold text-sm hover:underline cursor-pointer"
          >
            View All Statistics
          </button>
        </div>
      </Card>

      <CoursesCompletionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default TopCoursesGrades;
