import React from 'react';
import Modal from '../Modal';
import Button from '../Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', isDestructive = true, isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="py-2">
        <p className="text-gray-text text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-5 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-gray-text hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <Button
            onClick={onConfirm}
            loading={isLoading}
            className={`h-10 px-6 ${isDestructive ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : ''}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
