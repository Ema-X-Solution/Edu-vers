import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Loader, Card } from '@/shared/ui';
import { fetchCourseById } from '../services/coursesService';
import { Book, Code, GraduationCap, Hash, User, ArrowLeft } from 'lucide-react';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchCourseById(id)
        .then(data => setCourse(data))
        .catch(err => setError(err.message || 'Failed to fetch course details'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-dark-blue hover:border-dark-blue transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Course Details</h1>
          <p className="text-gray-text text-sm mt-1">View complete information and marks distribution.</p>
        </div>
      </div>

      <Card className="min-h-[60vh]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full py-20"><Loader size="lg" /></div>
        ) : error ? (
          <div className="text-red-500 py-10 text-center text-lg">{error}</div>
        ) : course ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-lighter-main to-white p-6 rounded-2xl border border-[#0D9488]/20 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-dark-blue flex items-center gap-3 mb-2">
                    <Book className="text-main" size={28} /> 
                    {course.name}
                  </h2>
                  <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-700 font-medium">
                    <span className="flex items-center gap-1.5"><Code size={18} className="text-gray-400"/> {course.code}</span>
                    <span className="flex items-center gap-1.5"><Hash size={18} className="text-gray-400"/> {course.creditHours} Credits</span>
                    <span className="flex items-center gap-1.5"><GraduationCap size={18} className="text-gray-400"/> Year {course.academicYear} ({course.semester})</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${course.isTraining ? 'bg-[#e0e7ff] text-[#4f46e5]' : 'bg-[#f3e8ff] text-[#9333ea]'}`}>
                  {course.isTraining ? 'Training' : 'Academic'}
                </span>
              </div>
              
              {(course.professorName || course.professor) && (
                <div className="mt-6 pt-5 border-t border-[#0D9488]/10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-main/10 flex items-center justify-center">
                    <User size={20} className="text-main" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Assigned Professor</p>
                    <p className="font-bold text-dark-blue">{course.professorName || course.professor?.name}</p>
                    {course.professor?.email && <p className="text-sm text-gray-500">{course.professor.email}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-lg font-bold text-dark-blue mb-3">Course Description</h3>
              <p className="text-gray-text leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100">
                {course.description || 'No description provided.'}
              </p>
            </div>

            {/* Marks Distribution */}
            {course.marksDistribution && (
              <div>
                <h3 className="text-lg font-bold text-dark-blue mb-4">Marks Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(course.marksDistribution).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center hover:border-main transition-colors">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2 text-center">
                        {key.replace(/([A-Z0-9])/g, ' $1')}
                      </span>
                      <div className="w-12 h-12 rounded-full bg-lighter-main flex items-center justify-center text-xl font-black text-main">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Card>
    </DashboardLayout>
  );
};

export default CourseDetailsPage;
