import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@/shared/ui';
import httpClient from '@/shared/services/httpClient';
import { Calendar, Type, BookOpen, Loader2 } from 'lucide-react';

const EditTaskModal = ({ isOpen, onClose, taskId, onSuccess }) => {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxMarkAssessment, setMaxMarkAssessment] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const ASSESSMENT_TYPES = [
    { value: 'assignment1', label: 'Assignment 1' },
    { value: 'assignment2', label: 'Assignment 2' },
    { value: 'midterm',     label: 'Midterm Exam'  },
    { value: 'final',       label: 'Final Exam'    },
    { value: 'practical',   label: 'Practical'     },
  ];

  useEffect(() => {
    if (isOpen && taskId) {
      const fetchTask = async () => {
        try {
          setIsLoading(true);
          setError(null);
          setSuccess(false);
          const res = await httpClient.get(`/assessments/${taskId}`);
          const data = res?.data || res;
          
          setName(data.name || '');
          setType(data.type || '');
          setMaxMarkAssessment(data.maxMarkAssessment || '');
          
          if (data.deadline) {
            // Format for datetime-local: YYYY-MM-DDTHH:mm
            const d = new Date(data.deadline);
            const formatted = d.toISOString().slice(0, 16);
            setDeadline(formatted);
          } else {
            setDeadline('');
          }
        } catch (err) {
          console.error('Failed to load task details:', err);
          setError('Failed to load task details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchTask();
    } else {
      setName('');
      setType('');
      setDeadline('');
      setMaxMarkAssessment('');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !name || !deadline) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = {
        name,
        type,
        deadline: new Date(deadline).toISOString()
      };

      await httpClient.patch(`/assessments/${taskId}`, payload);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-[#0D9488]" size={32} />
          </div>
        ) : success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark-blue mb-2">Task Updated Successfully</h3>
            <p className="text-gray-500">The task information has been saved.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Name</label>
                  <Input 
                    placeholder="e.g. Assignment 1"
                    icon={Type}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Mark</label>
                  <Input 
                    type="number"
                    placeholder="e.g. 10"
                    icon={Type}
                    value={maxMarkAssessment}
                    onChange={(e) => setMaxMarkAssessment(e.target.value)}
                    disabled
                  />
                </div>
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
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default EditTaskModal;
