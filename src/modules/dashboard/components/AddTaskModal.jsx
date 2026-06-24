import React, { useState } from 'react';
import { Modal, Button, Input } from '@/shared/ui';
import httpClient from '@/shared/services/httpClient';
import { UploadCloud, Calendar, Type, BookOpen, X } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, courses }) => {
  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Matches backend AssessmentTypeEnum
  const ASSESSMENT_TYPES = [
    { value: 'assignment1', label: 'Assignment 1' },
    { value: 'assignment2', label: 'Assignment 2' },
    { value: 'midterm',     label: 'Midterm Exam'  },
    { value: 'final',       label: 'Final Exam'    },
    { value: 'practical',   label: 'Practical'     },
  ];

  const validCourses = Array.isArray(courses) ? courses : [];

  // Reset state when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setCourseId(courses?.[0]?.id || courses?.[0]?.courseId || courses?.[0]?._id || '');
      setType('');
      setName('');
      setDeadline('');
      setFile(null);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !type || !name || !deadline || !file) {
      setError('Please fill in all fields and select a file.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseId', courseId);
      formData.append('type', type);
      formData.append('name', name);
      // Format deadline to ISO if needed, datetime-local value is like '2026-07-20T23:59'
      const isoDeadline = new Date(deadline).toISOString();
      formData.append('deadline', isoDeadline);

      await httpClient.post('/assessments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.response?.data?.message || 'Failed to add task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <div className="p-6">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark-blue mb-2">Task Added Successfully</h3>
            <p className="text-gray-500">Your task has been uploaded and assigned to the course.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all text-sm font-medium outline-none appearance-none"
                    required
                  >
                    <option value="" disabled>Select a course</option>
                    {validCourses.map(c => (
                      <option key={c.id || c.courseId || c._id} value={c.id || c.courseId || c._id}>
                        {c.name || c.courseName} ({c.code || c.courseCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Name</label>
                <Input 
                  placeholder="e.g. Assignment 1: Problem Solving"
                  icon={Type}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Type</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all text-sm font-medium outline-none appearance-none"
                      required
                    >
                      <option value="" disabled>Select type</option>
                      {ASSESSMENT_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deadline</label>
                  <Input 
                    type="datetime-local"
                    icon={Calendar}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upload File</label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${file ? 'border-[#0D9488] bg-teal-50' : 'border-gray-200 hover:border-[#0D9488] bg-gray-50 hover:bg-white'}`}
                >
                  <input
                    type="file"
                    id="task-file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <label htmlFor="task-file" className="cursor-pointer flex flex-col items-center">
                    {file ? (
                      <>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                          <BookOpen className="text-[#0D9488]" size={24} />
                        </div>
                        <p className="text-sm font-bold text-dark-blue mb-1">{file.name}</p>
                        <p className="text-xs font-medium text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                          <UploadCloud className="text-gray-400" size={24} />
                        </div>
                        <p className="text-sm font-bold text-dark-blue mb-1">Click to browse or drag and drop</p>
                        <p className="text-xs font-medium text-gray-500">PDF, DOCX, or ZIP (Max 10MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Uploading...' : 'Add Task'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AddTaskModal;
