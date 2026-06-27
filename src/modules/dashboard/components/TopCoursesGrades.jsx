import React, { useState } from 'react';
import { Card } from '@/shared/ui';
import CoursesCompletionModal from './CoursesCompletionModal';

const COLORS = ['bg-teal-500', 'bg-orange-500', 'bg-indigo-900', 'bg-purple-500', 'bg-pink-500'];

const TopCoursesGrades = ({ courses = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validCourses = Array.isArray(courses) ? courses : [];
  
  // Map API format {percentage: 98} to UI format for all courses
  const allFormattedCourses = validCourses.map((c, idx) => ({
    name: c.courseName || `Course ${idx + 1}`,
    grade: c.percentage || 0,
    color: COLORS[idx % COLORS.length]
  }));
  
  // Show only top 4
  const displayCourses = allFormattedCourses.slice(0, 4);

  return (
    <>
      <Card className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-bold text-dark-blue mb-6">Top courses grades</h2>
        
        <div className="flex-1 space-y-5">
          {displayCourses.length > 0 ? displayCourses.map((course, idx) => (
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
          )) : (
            <div className="text-gray-400 text-sm mt-4">No top courses available.</div>
          )}
        </div>

        {validCourses.length > 4 && (
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-main font-semibold text-sm hover:underline cursor-pointer"
            >
              View All Statistics
            </button>
          </div>
        )}
      </Card>

      <CoursesCompletionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courses={allFormattedCourses}
      />
    </>
  );
};

export default TopCoursesGrades;
