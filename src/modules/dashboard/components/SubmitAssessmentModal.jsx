import React, { useState } from 'react';
import { Modal } from '@/shared/ui';
import { Link, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitAssessment } from '../../assessments/services/assessmentsService';

const SubmitAssessmentModal = ({ isOpen, onClose, assessment }) => {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !assessment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionUrl.trim()) {
      toast.error('Please enter a submission URL');
      return;
    }

    const assessmentId = assessment._id || assessment.id;

    if (!assessmentId) {
      toast.error('Invalid assessment ID');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAssessment(assessmentId, submissionUrl);
      toast.success('Assessment submitted successfully!');
      setSubmissionUrl('');
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(error.message || 'Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Assessment">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-dark-blue mb-1">
            {assessment.title || assessment.name || 'Assessment Submission'}
          </h3>
          <p className="text-sm text-gray-text">
            {assessment.course?.name || assessment.subject || 'Provide the link to your completed work.'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark-blue mb-2">
              Submission File URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link size={18} className="text-gray-400" />
              </div>
              <input
                type="url"
                required
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Please ensure your file URL (Google Drive, GitHub, etc.) is accessible to the instructor.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !submissionUrl.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmitAssessmentModal;
