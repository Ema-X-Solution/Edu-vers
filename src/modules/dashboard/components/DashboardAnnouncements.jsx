import React from 'react';
import { Card } from '@/shared/ui';
import { FileUp, Link, PenTool } from 'lucide-react';

const announcements = [
  {
    id: 1,
    title: 'assignment 1',
    subject: 'Data Mining',
    status: 'Due Tomorrow',
    statusColor: 'text-red-500',
    dotColor: 'bg-red-500',
    deadline: '24 oct',
    icon: Link,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-400'
  },
  {
    id: 2,
    title: 'Calculus assignment 2',
    subject: 'Mathematics 1',
    status: 'two days',
    statusColor: 'text-yellow-500',
    dotColor: 'bg-yellow-500',
    deadline: '24 oct',
    icon: FileUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500'
  },
  {
    id: 3,
    title: 'Cloud Essay 2',
    subject: 'Cloud',
    status: 'two weeks',
    statusColor: 'text-teal-500',
    dotColor: 'bg-teal-500',
    deadline: '24 oct',
    icon: PenTool,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  {
    id: 4,
    title: 'Cloud Essay 2',
    subject: 'Cloud',
    status: 'two weeks',
    statusColor: 'text-teal-500',
    dotColor: 'bg-teal-500',
    deadline: '24 oct',
    icon: PenTool,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500'
  }
];

const DashboardAnnouncements = () => {
  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full col-span-2">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-dark-blue">Announcements</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        {announcements.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-4 px-5 hover:bg-gray-50 transition-colors ${
                index !== announcements.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                  <ItemIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-dark-blue leading-tight mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-text">{item.subject}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`}></span>
                    <span className={`text-xs font-medium ${item.statusColor}`}>{item.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs font-bold text-dark-blue mb-0.5">Deadline</p>
                  <p className="text-xs text-gray-text">{item.deadline}</p>
                </div>
                <button className="w-8 h-8 rounded-lg bg-dark-blue text-white flex items-center justify-center hover:bg-opacity-90 transition">
                  <FileUp size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  );
};

export default DashboardAnnouncements;
