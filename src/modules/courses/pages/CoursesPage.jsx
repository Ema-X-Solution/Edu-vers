import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Card, Table, Pagination } from '@/shared/ui';
import useCourses from '../hooks/useCourses';
import { COURSES_TABLE_COLUMNS } from '../constants/coursesConstants.jsx';
import CoursesToolbar from '../components/CoursesToolbar';
import CourseActionsCell from '../components/CourseActionsCell';
import DeleteCourseModal from '../components/DeleteCourseModal';
import { deleteCourse } from '../services/coursesService';
import { ROUTES } from '@/shared/constants';

/**
 * CoursesPage — Manages the catalog of courses.
 */
const CoursesPage = () => {
  const navigate = useNavigate();
  const [deletingCourse, setDeletingCourse] = useState(null);

  const {
    data,
    total,
    isLoading,
    search,
    yearFilter,
    currentPage,
    pageSize,
    onSearch,
    onYearFilter,
    onPageChange,
    refetch,
  } = useCourses();

  // Navigate to the Create/Edit page, passing course data via state for editing
  const handleEdit = (course) => {
    navigate(`${ROUTES.COURSE_EDIT}/${course._id}`, { state: { course } });
  };

  const handleDeleteRequest = (course) => {
    setDeletingCourse(course);
  };

  const confirmDelete = async (id) => {
    try {
      await deleteCourse(id);
      refetch();
      setDeletingCourse(null);
    } catch (err) {
      alert(err.message || 'Failed to delete course');
    }
  };

  const columns = COURSES_TABLE_COLUMNS.map((col) =>
    col.key === 'actions'
      ? {
          ...col,
          render: (_, course) => (
            <CourseActionsCell
              course={course}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ),
        }
      : col
  );

  return (
    <DashboardLayout
      searchPlaceholder="Search courses..."
      onSearchChange={onSearch}
      topbarActions={
        <button
          onClick={() => navigate(ROUTES.COURSE_CREATE)}
          className="h-10 px-4 bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs rounded-xl shadow-[0_4px_12px_rgba(13,148,136,0.15)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>+</span> Add Course
        </button>
      }
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-blue">Courses Catalog</h1>
        <p className="text-gray-text text-sm mt-1">
          Manage academic and training courses, assign professors, and view course details.
        </p>
      </div>

      <Card noPadding>
        <CoursesToolbar
          search={search}
          yearFilter={yearFilter}
          onSearch={onSearch}
          onYearFilter={onYearFilter}
        />

        <Table
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyStateText="No courses found matching your criteria."
        />

        <Pagination
          currentPage={currentPage}
          totalEntries={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </Card>

      <DeleteCourseModal
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={confirmDelete}
        course={deletingCourse}
      />
    </DashboardLayout>
  );
};

export default CoursesPage;
