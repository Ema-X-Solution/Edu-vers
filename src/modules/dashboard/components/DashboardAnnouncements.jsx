import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/ui';
import { FileUp, Loader2, Megaphone, PenTool } from 'lucide-react';
import { fetchAnnouncements } from '../../assessments/services/assessmentsService';
import SubmitAssessmentModal from './SubmitAssessmentModal';

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
        const data = Array.isArray(res?.data) ? res.data
          : Array.isArray(res) ? res
          : res?.announcements || [];
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

  // Color-code urgency from timeLeft string
  const getUrgencyStyle = (timeLeft = '') => {
    const lower = timeLeft.toLowerCase();
    if (lower.includes('hour') || lower === 'today' || lower.includes('1 day') || lower.includes('tomorrow'))
      return { dotColor: 'bg-red-500', textColor: 'text-red-500', label: timeLeft || 'Due Soon' };
    if (lower.includes('2 day') || lower.includes('3 day'))
      return { dotColor: 'bg-orange-400', textColor: 'text-orange-500', label: timeLeft };
    return { dotColor: 'bg-teal-500', textColor: 'text-teal-600', label: timeLeft };
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <>
      <Card className="p-0 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-dark-blue">Announcements</h2>
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-gray-400">
              <Loader2 className="w-7 h-7 animate-spin mb-2" />
              <p className="text-sm">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[180px] text-gray-400">
              <Megaphone size={30} className="mb-2 opacity-40" />
              <p className="text-sm font-medium">No announcements right now</p>
            </div>
          ) : (
            announcements.map((item, index) => {
              const urgency = getUrgencyStyle(item.timeLeft || '');
              const deadline = formatDeadline(item.deadlineDate || item.deadline || item.dueDate);

              return (
                <div
                  key={item.assessmentId || item._id || item.id || index}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                    index !== announcements.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* Left: Icon + Info */}
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <PenTool size={18} className="text-red-400" />
                    </div>

                    {/* Text */}
                    <div>
                      <h4 className="font-bold text-dark-blue text-sm leading-tight mb-0.5">
                        {item.title || item.name || 'Announcement'}
                      </h4>
                      <p className="text-xs text-gray-400 mb-1">
                        {item.courseName || item.course?.name || item.course || 'General'}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${urgency.dotColor}`} />
                        <span className={`text-xs font-semibold ${urgency.textColor}`}>
                          {urgency.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Deadline + Submit */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs font-bold text-dark-blue mb-0.5">Deadline</p>
                      <p className="text-xs text-gray-400">{deadline}</p>
                    </div>
                    <button
                      onClick={() => handleOpenSubmit(item)}
                      className="w-10 h-10 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white flex items-center justify-center transition-colors shadow-sm shadow-teal-500/20"
                    >
                      <FileUp size={17} />
                    </button>
                  </div>
                </div>
              );
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
