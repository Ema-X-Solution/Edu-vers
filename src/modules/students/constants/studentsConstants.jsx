// Column definitions for the students table
// Using a `render` function allows any cell to output custom JSX without polluting the page component
export const STUDENTS_TABLE_COLUMNS = [
  { key: 'academicId',     header: 'Student ID'    },
  { key: 'fullName',   header: 'Name'          },
  { key: 'email',  header: 'Email Address' },
  { key: 'department',  header: 'Major'         },
  {
    key: 'status',
    header: 'Status',
    render: (value) => {
      const isAct = value?.toLowerCase() === 'active';
      return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          isAct
            ? 'bg-percentage-up/10 text-percentage-up'
            : 'bg-percentage-down/10 text-percentage-down'
        }`}
      >
        {value}
      </span>
      );
    },
  },
  { key: 'actions', header: 'Actions', align: 'right' },
];

export const STUDENTS_STATUS_OPTIONS = [
  { value: '',         label: 'All Status'  },
  { value: 'Active',   label: 'Active'      },
  { value: 'Inactive', label: 'Inactive'    },
];

export const MOCK_STUDENTS = [
  { id: 'STU001', name: 'John Doe',      email: 'john@example.com',    major: 'Computer Science', status: 'Active'   },
  { id: 'STU002', name: 'Jane Smith',    email: 'jane@example.com',    major: 'Business Admin',   status: 'Active'   },
  { id: 'STU003', name: 'Alice Johnson', email: 'alice@example.com',   major: 'Engineering',      status: 'Inactive' },
  { id: 'STU004', name: 'Bob Brown',     email: 'bob@example.com',     major: 'Mathematics',      status: 'Active'   },
  { id: 'STU005', name: 'Charlie Davis', email: 'charlie@example.com', major: 'Physics',          status: 'Active'   },
  { id: 'STU006', name: 'Diana Prince',  email: 'diana@example.com',   major: 'Literature',       status: 'Inactive' },
  { id: 'STU007', name: 'Ethan Hunt',    email: 'ethan@example.com',   major: 'Computer Science', status: 'Active'   },
  { id: 'STU008', name: 'Fiona Green',   email: 'fiona@example.com',   major: 'Chemistry',        status: 'Active'   },
];

export const STUDENTS_PAGE_SIZE = 15;
