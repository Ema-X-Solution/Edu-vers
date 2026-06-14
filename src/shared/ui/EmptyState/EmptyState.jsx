import React from 'react';
import Button from '../Button';

const EmptyState = ({
  icon: Icon,
  title = 'No results found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  onActionClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-[#E2E8F0] min-h-[300px]">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-gray-400 mb-4">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-base font-semibold text-dark-blue mb-1">{title}</h3>
      <p className="text-sm text-gray-text max-w-sm mb-6">{description}</p>
      {actionText && onActionClick && (
        <Button variant="primary" size="sm" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
