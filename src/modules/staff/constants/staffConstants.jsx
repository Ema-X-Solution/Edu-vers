export const STAFF_TABLE_COLUMNS = [
  { key: 'academicId', header: 'Academic ID' },
  { key: 'fullName', header: 'Name' },
  { key: 'email', header: 'Email Address' },
  { key: 'role', header: 'Role' },
  { key: 'department', header: 'Department' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => {
      const displayValue = value || 'Active';
      return (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            displayValue === 'Active'
              ? 'bg-percentage-up/10 text-percentage-up'
              : 'bg-percentage-down/10 text-percentage-down'
          }`}
        >
          {displayValue}
        </span>
      );
    },
  },
  { key: 'actions', header: 'Actions', align: 'right' },
];

export const STAFF_STATUS_OPTIONS = [
  { value: '',         label: 'All Status'  },
  { value: 'Active',   label: 'Active'      },
  { value: 'Inactive', label: 'Inactive'    },
];

export const STAFF_PAGE_SIZE = 5;
