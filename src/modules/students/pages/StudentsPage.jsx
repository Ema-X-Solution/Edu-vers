import React, { useState } from 'react';
import { DashboardLayout } from '@/app/layouts';
import { Button, Card, Table, Pagination, ConfirmModal } from '@/shared/ui';
import useStudents from '../hooks/useStudents';
import { STUDENTS_TABLE_COLUMNS } from '../constants/studentsConstants.jsx';
import StudentsToolbar from '../components/StudentsToolbar';
import StudentActionsCell from '../components/StudentActionsCell';
import CreateStudentModal from '../components/CreateStudentModal';
import EditStudentModal from '../components/EditStudentModal';

/**
 * StudentsPage — pure presentational shell.
 * All data-fetching and business logic delegated to useStudents().
 */
const StudentsPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  } = useStudents();

  const confirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      const { deleteStudent } = await import('../services/studentsService');
      await deleteStudent(deletingStudent._id);
      refetch?.();
      setDeletingStudent(null);
    } catch (err) {
      alert(err.message || 'Failed to delete student.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = (student) => {
    setDeletingStudent(student);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const columns = STUDENTS_TABLE_COLUMNS.map((col) =>
    col.key === 'actions'
      ? {
          ...col,
          render: (_, student) => <StudentActionsCell student={student} onEdit={handleEdit} onDelete={handleDelete} />,
        }
      : col
  );

  return (
    <DashboardLayout
      searchPlaceholder="Search students by name, ID or email..."
      onSearchChange={onSearch}
      topbarActions={
        <button
          onClick={() => setCreateModalOpen(true)}
          className="h-10 px-4 bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs rounded-xl shadow-[0_4px_12px_rgba(13,148,136,0.15)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>+</span> Add Student
        </button>
      }
    >
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-blue">Students</h1>
        <p className="text-gray-text text-sm mt-1">
          Manage all registered students and their academic records.
        </p>
      </div>

      {/* Table card */}
      <Card noPadding>
        <StudentsToolbar
          search={search}
          statusFilter={statusFilter}
          onSearch={onSearch}
          onStatusFilter={onStatusFilter}
        />

        <Table
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyStateText="No students match your search."
        />

        <Pagination
          currentPage={currentPage}
          totalEntries={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </Card>

      {/* Create Student Modal */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => refetch?.()}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={!!editingStudent}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSuccess={() => refetch?.()}
      />

      <ConfirmModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${deletingStudent?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
};

export default StudentsPage;

