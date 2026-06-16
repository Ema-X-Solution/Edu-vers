import React, { useState } from 'react';
import { DashboardLayout } from '@/app/layouts';
import { Button, Card, Table, Pagination } from '@/shared/ui';
import useStaff from '../hooks/useStaff';
import { STAFF_TABLE_COLUMNS } from '../constants/staffConstants.jsx';
import StaffToolbar from '../components/StaffToolbar';
import StaffActionsCell from '../components/StaffActionsCell';
import CreateStaffModal from '../components/CreateStaffModal';

/**
 * StaffPage — Academic Staff listing page.
 * Uses real API to fetch and render the Staff list.
 */
const StaffPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const {
    data,
    total,
    isLoading,
    search,
    statusFilter,
    currentPage,
    pageSize,
    onSearch,
    onStatusFilter,
    onPageChange,
    refetch,
  } = useStaff();

  const columns = STAFF_TABLE_COLUMNS.map((col) =>
    col.key === 'actions'
      ? {
          ...col,
          render: (_, staff) => <StaffActionsCell staff={staff} />,
        }
      : col
  );

  return (
    <DashboardLayout
      searchPlaceholder="Search staff by name, ID or email..."
      onSearchChange={onSearch}
      topbarActions={
        <button
          onClick={() => setCreateModalOpen(true)}
          className="h-10 px-4 bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs rounded-xl shadow-[0_4px_12px_rgba(13,148,136,0.15)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>+</span> Add Staff Member
        </button>
      }
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-blue">Academic Staff</h1>
        <p className="text-gray-text text-sm mt-1">
          Manage doctors and teaching assistants across all departments.
        </p>
      </div>

      <Card noPadding>
        <StaffToolbar
          search={search}
          statusFilter={statusFilter}
          onSearch={onSearch}
          onStatusFilter={onStatusFilter}
        />

        <Table
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyStateText="No staff members match your search."
        />

        <Pagination
          currentPage={currentPage}
          totalEntries={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </Card>

      <CreateStaffModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => refetch?.()}
      />
    </DashboardLayout>
  );
};

export default StaffPage;
