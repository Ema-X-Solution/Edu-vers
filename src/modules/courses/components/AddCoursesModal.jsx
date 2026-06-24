import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui';
import { fetchAvailableCourses, confirmRegistration } from '../services/coursesService';
import { Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddCoursesModal = ({ isOpen, onClose, semester }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen && semester) {
      loadCourses();
      setSelectedCourseIds([]);
      setSearch('');
    }
  }, [isOpen, semester]);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAvailableCourses(semester);
      const data = res?.data?.courses || res?.courses || res?.data || res || [];
      // Flatten the response if it's wrapped
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load available courses:', error);
      toast.error('Failed to load available courses');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCourseIds.length < 5) {
      toast.error('You must select at least 5 courses to register.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmRegistration(selectedCourseIds, semester);
      toast.success('Courses registered successfully!');
      onClose(true); // pass true to indicate success and trigger reload on parent
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMsg = 'Failed to register courses';
      if (error?.message) {
        errorMsg = Array.isArray(error.message) ? error.message.join('\n') : error.message;
      }
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.courseName?.toLowerCase().includes(search.toLowerCase()) || 
    c.courseCode?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCoursesData = courses.filter(c => selectedCourseIds.includes(c.courseId));
  const totalCredits = selectedCoursesData.reduce((sum, c) => sum + (c.creditHours || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Courses" size="xl">
      <div className="flex flex-col h-[70vh]">
        {/* Header section inside modal */}
        <div className="shrink-0 space-y-4 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Select courses available for registration this semester.</span>
            <span className="text-main font-bold">Semester: {semester}</span>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course code or name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-main outline-none"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1 text-center">Sel</div>
            <div className="col-span-2">Code</div>
            <div className="col-span-4">Course Name</div>
            <div className="col-span-3">Instructor</div>
            <div className="col-span-2 text-center">Credits</div>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto min-h-0 border-b border-gray-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Loading available courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No courses found for {semester} semester.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredCourses.map((course) => {
                const isEnrolled = course.isAlreadyEnrolled;
                const isSelected = selectedCourseIds.includes(course.courseId);
                return (
                <div
                  key={course.courseId}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-50 items-center transition-colors ${
                    isEnrolled ? 'opacity-60 bg-gray-50' : 'cursor-pointer hover:bg-gray-50'
                  } ${isSelected ? 'bg-lighter-main hover:bg-lighter-main' : ''}`}
                  onClick={() => !isEnrolled && handleToggleCourse(course.courseId)}
                >
                  <div className="col-span-1 flex justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected || isEnrolled}
                      disabled={isEnrolled}
                      onChange={() => !isEnrolled && handleToggleCourse(course.courseId)}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-4 h-4 rounded border-gray-300 accent-main ${isEnrolled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                  </div>
                  <div className="col-span-2 text-sm font-bold text-main">{course.courseCode}</div>
                  <div className="col-span-4 text-sm font-bold text-dark-blue truncate">
                    {course.courseName}
                    {isEnrolled && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Enrolled</span>}
                  </div>
                  <div className="col-span-3 text-xs text-gray-500 truncate">{course.professorName || 'TBA'}</div>
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <span className="text-sm font-bold text-dark-blue">{course.creditHours}</span>
                    <span className="text-xs text-gray-400">Cr</span>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 pt-4 flex items-center justify-between mt-2">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Selected Courses</p>
              <p className={`text-xl font-black ${selectedCourseIds.length >= 5 ? 'text-main' : 'text-orange-500'}`}>
                {selectedCourseIds.length} <span className="text-sm font-medium text-gray-500">/ 5 min</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Total Credits</p>
              <p className="text-xl font-black text-dark-blue">{totalCredits}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onClose(false)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedCourseIds.length < 5}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors flex items-center gap-2
                ${selectedCourseIds.length < 5 || isSubmitting
                  ? 'bg-main/50 cursor-not-allowed'
                  : 'bg-main hover:bg-main-hover cursor-pointer'
                }`}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Register Selected Courses
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddCoursesModal;
