import React from 'react';
import { Card } from '@/shared/ui';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardCommunities = ({ communities = [] }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full">
      <div className="p-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-dark-blue">Recent communities</h2>
        <button 
          onClick={() => navigate('/student-communities')}
          className="text-main text-xs font-bold hover:underline"
        >
          View All
        </button>
      </div>
      
      <div className="flex-1 px-5 pb-5 space-y-4 overflow-y-auto scrollbar-thin">
        {Array.isArray(communities) && communities.length > 0 ? communities.map((community) => (
          <div 
            key={community.id} 
            onClick={() => navigate(`/student-communities/${community.id}`)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
          >
            <div className="w-1 bg-main h-6 rounded-r-md -ml-7 opacity-0 hover:opacity-100 transition-opacity"></div>
            
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500 shrink-0`}>
              <Users size={20} />
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-dark-blue">{community.name}</h4>
              <p className="text-[11px] text-gray-text">Active Community</p>
            </div>
          </div>
        )) : (
          <div className="text-gray-400 text-sm mt-4">No communities joined.</div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCommunities;
