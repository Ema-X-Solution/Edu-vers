import React from 'react';
import { Eye } from 'lucide-react';
import { Card, Button } from '@/shared/ui';

const StudentCourseCard = ({ 
  code, 
  title, 
  credits, 
  description, 
  profName, 
  profDepartment, 
  profImage, 
  courseImage 
}) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Course Image */}
      <div className="relative h-40 w-full bg-gray-100 shrink-0">
        <img 
          src={courseImage || 'https://via.placeholder.com/400x200'} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-teal-600 shadow-sm">
          {code}
        </div>
      </div>

      {/* Course Details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {title}
          </h3>
          <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
            {credits} Credits
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        {/* Professor Info */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <img 
              src={profImage || 'https://via.placeholder.com/40'} 
              alt={profName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">{profName}</span>
            <span className="text-xs text-gray-500">{profDepartment}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-auto">
          <Button variant="primary" className="flex-1 py-2 rounded-xl text-sm font-bold bg-teal-500 hover:bg-teal-600">
            Register Course
          </Button>
          <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors shrink-0">
            <Eye size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default StudentCourseCard;
