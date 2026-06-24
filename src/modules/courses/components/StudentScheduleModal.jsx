import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui';
import { getMySchedule } from '../services/coursesService';
import { Loader2, Book, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentScheduleModal = ({ isOpen, onClose, semester }) => {
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && semester) {
      loadSchedule();
    }
  }, [isOpen, semester]);

  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      const res = await getMySchedule(semester);
      // The API returns an object with semester, totalCourses, totalCreditHours, and courses array
      setScheduleData(res?.data || res || null);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      toast.error('Failed to load schedule');
      setScheduleData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const courses = scheduleData?.courses || [];
  const totalCredits = scheduleData?.totalCreditHours || 0;
  const totalCourses = scheduleData?.totalCourses || courses.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`My Enrolled Courses - ${semester || ''}`} size="lg">
      <div className="w-full min-h-[300px] flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading your schedule...</p>
          </div>
        ) : !scheduleData || courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <Book className="w-12 h-12 mb-3 opacity-30" />
            <p>You have no courses registered for {semester}.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-2">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                  <Book size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Courses</p>
                  <p className="text-xl font-black text-dark-blue">{totalCourses}</p>
                </div>
              </div>
              <div className="bg-teal-50 border border-teal-100 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Credits</p>
                  <p className="text-xl font-black text-dark-blue">{totalCredits} Hours</p>
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <div className="col-span-3">Code</div>
                <div className="col-span-5">Course Name</div>
                <div className="col-span-3">Instructor</div>
                <div className="col-span-1 text-center">Cr</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {courses.map(course => (
                  <div key={course.enrollmentId} className="grid grid-cols-12 gap-4 px-4 py-3 items-center bg-white hover:bg-gray-50 transition-colors">
                    <div className="col-span-3 text-sm font-bold text-main">{course.courseCode}</div>
                    <div className="col-span-5">
                      <p className="text-sm font-bold text-dark-blue truncate">{course.courseName}</p>
                      {course.isTraining && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full font-bold">
                          Training
                        </span>
                      )}
                    </div>
                    <div className="col-span-3 flex items-center gap-1.5 text-xs text-gray-500 truncate">
                      <User size={12} className="shrink-0" />
                      <span className="truncate">{course.professorName || 'TBA'}</span>
                    </div>
                    <div className="col-span-1 text-center text-sm font-bold text-dark-blue">
                      {course.creditHours}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </Modal>
  );
};

export default StudentScheduleModal;
