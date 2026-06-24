import React from 'react';
import { Modal } from '@/shared/ui';

export const SemesterEnum = {
  FALL: 'FALL',
  SPRING: 'SPRING',
  SUMMER: 'SUMMER',
};

const SemesterPickerModal = ({ isOpen, onClose, onSelect, title = "Select Semester" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-4 py-4">
        <p className="text-gray-text text-sm">
          Please select the semester you want to view or register courses for.
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {Object.values(SemesterEnum).map((semester) => (
            <button
              key={semester}
              onClick={() => onSelect(semester)}
              className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 hover:border-main hover:bg-lighter-main transition-all font-bold text-dark-blue flex items-center justify-between group cursor-pointer"
            >
              <span>{semester.charAt(0).toUpperCase() + semester.slice(1).toLowerCase()} Semester</span>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-main flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-main opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-dark-blue transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SemesterPickerModal;
