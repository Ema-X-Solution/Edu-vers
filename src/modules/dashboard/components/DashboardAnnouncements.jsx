import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/ui';
import { FileUp, Link, PenTool, Loader2, Megaphone } from 'lucide-react';
import { fetchAnnouncements } from '../../assessments/services/assessmentsService';
import SubmitAssessmentModal from './SubmitAssessmentModal';

// Fallback icon map based on keywords or default
const getIconProps = (typeOrTitle = '') => {
  const lower = typeOrTitle.toLowerCase();
  if (lower.includes('assignment')) return { icon: FileUp, iconBg: 'bg-green-50', iconColor: 'text-green-500' };
  if (lower.includes('essay')) return { icon: PenTool, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' };
  if (lower.includes('link')) return { icon: Link, iconBg: 'bg-red-50', iconColor: 'text-red-400' };
  return { icon: Megaphone, iconBg: 'bg-teal-50', iconColor: 'text-teal-500' };
};

const DashboardAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAnnouncements();
        // Assume res.data is the array, or res is the array
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : res?.announcements || [];
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  const handleOpenSubmit = (item) => {
    setSelectedAssessment(item);
    setIsSubmitModalOpen(true);
  };

  return (
    <>
      <Card className="p-0 overflow-hidden flex flex-col h-full col-span-2">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-dark-blue">Announcements</h2>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
              <Megaphone size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">No announcements right now</p>
            </div>
          ) : (
            announcements.map((item, index) => {
              const { icon: ItemIcon, iconBg, iconColor } = getIconProps(item.type || item.title);
              
              // Format status and deadline if provided by backend
              const deadlineText = item.deadline || item.dueDate || item.endDate 
                ? new Date(item.deadline || item.dueDate || item.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) 
                : 'No Deadline';
              
              const subjectText = typeof item.course === 'object' ? item.course?.name || item.course?.code : (item.course || item.subject || 'General');
              const statusText = item.status || 'Active';
              const isUrgent = String(item.status || '').toLowerCase().includes('due tomorrow') || String(item.deadline || '').toLowerCase().includes('tomorrow');
              const dotColor = isUrgent ? 'bg-red-500' : 'bg-teal-500';
              const statusColor = isUrgent ? 'text-red-500' : 'text-teal-500';

              return (
                <div 
                  key={item._id || item.id || index} 
                  className={`flex items-center justify-between p-4 px-5 hover:bg-gray-50 transition-colors ${
                    index !== announcements.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
                      <ItemIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-blue leading-tight mb-1">{item.title || item.name || 'Announcement'}</h4>
                      <p className="text-xs text-gray-text">{subjectText}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                        <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs font-bold text-dark-blue mb-0.5">Deadline</p>
                      <p className="text-xs text-gray-text">{deadlineText}</p>
                    </div>
                    <button 
                      onClick={() => handleOpenSubmit(item)}
                      className="w-8 h-8 rounded-lg bg-dark-blue text-white flex items-center justify-center hover:bg-opacity-90 transition cursor-pointer"
                    >
                      <FileUp size={16} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>

      <SubmitAssessmentModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        assessment={selectedAssessment}
      />
    </>
  );
};

export default DashboardAnnouncements;
