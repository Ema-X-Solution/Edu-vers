import { useState, useEffect, useCallback } from 'react';
import { fetchCourses } from '../services/coursesService';
import { COURSES_PAGE_SIZE } from '../constants/coursesConstants.jsx';
import { useDebounce } from '@/shared/hooks';

/**
 * useCourses — encapsulates ALL business logic for the courses list.
 */
const useCourses = () => {
  const [data,          setData]          = useState([]);
  const [total,         setTotal]         = useState(0);
  const [isLoading,     setIsLoading]     = useState(false);
  const [searchInput,   setSearchInput]   = useState('');
  const [yearFilter,    setYearFilter]    = useState('');
  const [currentPage,   setCurrentPage]   = useState(1);

  const debouncedSearch = useDebounce(searchInput, 400);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchCourses({
        search: debouncedSearch,
        year:   yearFilter,
        page:   currentPage,
        limit:  COURSES_PAGE_SIZE,
      });
      // Handle the API structure { data: [...], meta: { total: ... } }
      setData(result.data || []);
      setTotal(result.meta?.total || result.data?.length || 0);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, yearFilter, currentPage]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = useCallback((value) => {
    setSearchInput(value);
    setCurrentPage(1); // Reset to page 1 on search
  }, []);

  const handleYearFilter = useCallback((value) => {
    setYearFilter(value);
    setCurrentPage(1); // Reset to page 1 on filter
  }, []);

  return {
    data,
    total,
    isLoading,
    search:       searchInput,
    yearFilter,
    currentPage,
    pageSize:     COURSES_PAGE_SIZE,
    onSearch:     handleSearch,
    onYearFilter: handleYearFilter,
    onPageChange: setCurrentPage,
    refetch:      load,
  };
};

export default useCourses;
