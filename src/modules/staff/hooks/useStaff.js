import { useState, useEffect, useCallback } from 'react';
import { fetchStaff } from '../services/staffService';
import { STAFF_PAGE_SIZE } from '../constants/staffConstants.jsx';
import { useDebounce } from '@/shared/hooks';

/**
 * useStaff — encapsulates ALL business logic for the staff list.
 */
const useStaff = () => {
  const [data,          setData]          = useState([]);
  const [total,         setTotal]         = useState(0);
  const [isLoading,     setIsLoading]     = useState(false);
  const [searchInput,   setSearchInput]   = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [currentPage,   setCurrentPage]   = useState(1);

  const debouncedSearch = useDebounce(searchInput, 400);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchStaff({
        search:   debouncedSearch,
        status:   statusFilter,
        page:     currentPage,
        pageSize: STAFF_PAGE_SIZE,
      });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to load staff', err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, currentPage]);

  useEffect(() => { load(); }, [load]);

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
    pageSize:     STAFF_PAGE_SIZE,
    onSearch:         handleSearch,
    onStatusFilter:   handleStatusFilter,
    onPageChange:     setCurrentPage,
    refetch:          load,
  };
};

export default useStaff;
