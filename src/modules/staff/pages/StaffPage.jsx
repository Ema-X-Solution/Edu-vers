import React, { useState } from 'react';
import { DashboardLayout } from '@/app/layouts';
import { Button, Card } from '@/shared/ui';
import { Users } from 'lucide-react';
import CreateStaffModal from '../components/CreateStaffModal';

/**
 * StaffPage — Academic Staff listing page.
 * Staff list data will be connected when backend endpoint is ready.
 */
const StaffPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <DashboardLayout
      topbarActions={
        <button
          onClick={() => setCreateModalOpen(true)}
          className="h-10 px-4 bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs rounded-xl shadow-[0_4px_12px_rgba(13,148,136,0.15)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>+</span> Add Staff Member
        </button>
      }
    >
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-blue">Academic Staff</h1>
        <p className="text-gray-text text-sm mt-1">
          Manage doctors and teaching assistants across all departments.
        </p>
      </div>

      {/* Placeholder — will be replaced with a Table when the staff list endpoint is ready */}
      <Card>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-lighter-main flex items-center justify-center mb-4">
            <Users className="text-main" size={28} />
          </div>
          <h3 className="text-base font-bold text-dark-blue mb-1">Staff Directory Coming Soon</h3>
          <p className="text-gray-text text-sm max-w-xs">
            The staff list will appear here once the backend endpoint is connected.
            You can still add new staff members using the button above.
          </p>
        </div>
      </Card>

      {/* Create Staff Modal */}
      <CreateStaffModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => { /* refetch when list is ready */ }}
      />
    </DashboardLayout>
  );
};

export default StaffPage;
