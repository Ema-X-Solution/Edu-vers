export const COURSES_PAGE_SIZE = 10;

export const COURSES_TABLE_COLUMNS = [
  { key: 'code', header: 'Course Code' },
  { key: 'name', header: 'Course Name' },
  { key: 'department', header: 'Department' },
  { key: 'academicYear', header: 'Academic Year', render: (val, row) => row.academicYear ? `Year ${row.academicYear}` : 'N/A' },
  { key: 'creditHours', header: 'Credit Hours' },
  { 
    key: 'type', 
    header: 'Type', 
    render: (val, row) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.isTraining ? 'bg-[#e0e7ff] text-[#4f46e5]' : 'bg-[#f3e8ff] text-[#9333ea]'}`}>
        {row.isTraining ? 'Training' : 'Academic'}
      </span>
    ) 
  },
  { key: 'actions', header: 'Actions', align: 'right' },
];

export const COURSE_YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
];

export const COURSE_SEMESTER_OPTIONS = [
  { value: 'FALL', label: 'Fall' },
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
];
