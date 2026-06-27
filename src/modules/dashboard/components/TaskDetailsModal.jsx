import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/shared/ui';
import httpClient from '@/shared/services/httpClient';
import { Calendar, Type, BookOpen, Loader2, Clock, FileText, Hash } from 'lucide-react';

const TaskDetailsModal = ({ isOpen, onClose, taskId }) => {
  const [taskDetails, setTaskDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && taskId) {
      const fetchTask = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const res = await httpClient.get(`/assessments/${taskId}`);
          setTaskDetails(res?.data || res);
        } catch (err) {
          console.error('Failed to load task details:', err);
          setError('Failed to load task details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchTask();
    } else {
      setTaskDetails(null);
      setError(null);
    }
  }, [isOpen, taskId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-[#0D9488]" size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        ) : taskDetails ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Type size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Task Name</p>
                  <p className="text-sm font-bold text-dark-blue">{taskDetails.name || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Type</p>
                    <p className="text-sm font-semibold text-gray-700 capitalize">{taskDetails.type || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Hash size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Max Mark</p>
                    <p className="text-sm font-semibold text-gray-700">{taskDetails.maxMarkAssessment ?? 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {taskDetails.deadline ? new Date(taskDetails.deadline).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Created At</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {taskDetails.createdAt ? new Date(taskDetails.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {taskDetails.fileUrl && (
                <div className="flex items-start gap-3 pt-2 border-t border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Attached File</p>
                    <a
                      href={taskDetails.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-[#0D9488] hover:underline"
                    >
                      View Attachment
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <Button 
                type="button" 
                className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
