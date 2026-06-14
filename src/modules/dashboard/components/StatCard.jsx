import React from 'react';
import { Card } from '@/shared/ui';

const StatCard = ({ title, value, icon: Icon, trend, isPositive }) => {
  return (
    <Card className="flex items-center justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div>
        <p className="text-gray-text text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-dark-blue">{value}</h3>
        {trend && (
          <p 
            className={`text-xs mt-2 font-semibold flex items-center gap-0.5 ${
              isPositive ? 'text-percentage-up' : 'text-percentage-down'
            }`}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{trend}</span>
            <span className="text-gray-light font-normal ml-1">this month</span>
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-full bg-lighter-main flex items-center justify-center text-main">
        <Icon size={24} />
      </div>
    </Card>
  );
};

export default StatCard;
