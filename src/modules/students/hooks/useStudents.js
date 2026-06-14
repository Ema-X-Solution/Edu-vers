import { useState, useEffect, useCallback } from 'react';
import { fetchStudents } from '../services/studentsService';
import { STUDENTS_PAGE_SIZE } from '../constants/studentsConstants.jsx';
import { useDebounce } from '@/shared/hooks';

/**
 * useStudents — encapsulates ALL business logic for the students list.
 * The page component calls this hook and only deals with rendering.
 *
 * Separation of concerns:
 *  - useStudents  → data fetching, filtering, pagination state
 *  - studentsService → network / mock data layer
 *  - StudentsPage → pure JSX rendering
 */
const useStudents = () => {
  const [data,          setData]          = useState([]);
  const [total,         setTotal]         = useState(0);
  const [isLoading,     setIsLoading]     = useState(false);
  const [searchInput,   setSearchInput]   = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [currentPage,   setCurrentPage]   = useState(1);

  // Debounce search so the service is not called on every keystroke
  const debouncedSearch = useDebounce(searchInput, 400);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchStudents({
        search:   debouncedSearch,
        status:   statusFilter,
        page:     currentPage,
        pageSize: STUDENTS_PAGE_SIZE,
      });
      setData(result.data);
      setTotal(result.total);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, currentPage]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 any time a filter changes
  const handleSearch = useCallback((value) => {
    setSearchInput(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  return {
    data,
    total,
    isLoading,
    search:       searchInput,
    statusFilter,
    currentPage,
    pageSize:     STUDENTS_PAGE_SIZE,
    onSearch:         handleSearch,
    onStatusFilter:   handleStatusFilter,
    onPageChange:     setCurrentPage,
    refetch:          load,
  };
};

export default useStudents;
