import React from 'react';
import { Card } from '@/shared/ui';
import { PenTool, MonitorPlay, Bot, Banknote } from 'lucide-react';

const communities = [
  {
    id: 1,
    name: 'Design Guild',
    stats: '12 replies • 5m ago',
    icon: PenTool,
    color: 'text-pink-500',
    bg: 'bg-pink-50'
  },
  {
    id: 2,
    name: 'CyberCrew',
    stats: '45 replies • 2h ago',
    icon: MonitorPlay,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: 3,
    name: 'Robotics Club',
    stats: '8 replies • 4h ago',
    icon: Bot,
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  {
    id: 4,
    name: 'Finance Society',
    stats: '12 replies • 5m ago',
    icon: Banknote,
    color: 'text-green-500',
    bg: 'bg-green-50'
  }
];

const DashboardCommunities = () => {
  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full">
      <div className="p-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-dark-blue">Recent communities</h2>
        <button className="text-main text-xs font-bold hover:underline">View All</button>
      </div>
      
      <div className="flex-1 px-5 pb-5 space-y-4">
        {communities.map((community) => {
          const Icon = community.icon;
          return (
            <div key={community.id} className="flex items-center gap-3">
              <div className="w-1 bg-main h-6 rounded-r-md -ml-5 opacity-0"></div> {/* Active indicator spacer/placeholder */}
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${community.bg} ${community.color}`}>
                <Icon size={20} />
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-dark-blue">{community.name}</h4>
                <p className="text-[11px] text-gray-text">{community.stats}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DashboardCommunities;
