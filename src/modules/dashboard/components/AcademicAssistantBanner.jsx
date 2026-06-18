import React, { useState } from 'react';
import { Card } from '@/shared/ui';
import { Bot } from 'lucide-react';
import AcademicAssistantDrawer from './AcademicAssistantDrawer';

const AcademicAssistantBanner = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Card 
        className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDrawerOpen(true)}
      >
        <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0">
          <Bot size={24} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-dark-blue tracking-wider mb-0.5">ACADEMIC ASSISTANT</h4>
          <p className="text-xs text-gray-text font-medium">Asking for help?, Just click and chat...</p>
        </div>
      </Card>

      <AcademicAssistantDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
};

export default AcademicAssistantBanner;
