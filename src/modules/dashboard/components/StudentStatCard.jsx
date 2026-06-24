import React from 'react';
import { Card } from '@/shared/ui';
import { Info } from 'lucide-react';

const StudentStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  progress, 
  statusText, 
  statusColor = 'text-gray-text',
  statusDotColor = 'bg-gray-400',
  iconBgColor = 'bg-green-50',
  iconColor = 'text-green-500',
  actionIcon: ActionIcon = Info,
  onActionClick,
  onStatusClick
}) => {
  return (
    <Card className="flex flex-col justify-between p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          <Icon size={20} />
        </div>
        <ActionIcon 
          size={18} 
          className="text-gray-light cursor-pointer hover:text-gray-text transition" 
          onClick={onActionClick}
        />
      </div>
      
      <div>
        <p className="text-gray-text text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-dark-blue mb-3">{value}</h3>
        
        {typeof progress === 'number' && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div 
              className={`h-1.5 rounded-full ${statusDotColor.replace('bg-', 'bg-')}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        {statusText && (
          <div 
            className={`flex items-center gap-1.5 mt-2 ${onStatusClick ? 'cursor-pointer hover:opacity-80 transition-opacity p-1 -ml-1 rounded-md hover:bg-gray-50 inline-flex' : ''}`}
            onClick={onStatusClick}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`}></span>
            <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudentStatCard;
