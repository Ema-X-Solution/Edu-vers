import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@/shared/ui';

const DeleteCourseModal = ({ isOpen, onClose, onConfirm, course }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!course) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm(course._id);
    setIsDeleting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Course" size="sm">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-dark-blue mb-2">Delete {course.name}?</h3>
        <p className="text-sm text-gray-text px-4">
          Are you sure you want to delete this course? This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-text hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <Button
          onClick={handleConfirm}
          loading={isDeleting}
          className="flex-1 h-10 !bg-red-600 hover:!bg-red-700 shadow-none border-none text-white"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteCourseModal;
