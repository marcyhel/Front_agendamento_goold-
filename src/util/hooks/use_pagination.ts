"use client";

import { useState, useCallback } from "react";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationHookProps {
  initialPage?: number;
  initialLimit?: number;
  onPageChange?: (page: number) => void;
}

export interface PaginationHookReturn {
  pagination: PaginationState;
  filters: {
    page: number;
    limit: number;
  };
  setPagination: (newPagination: Partial<PaginationState>) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  resetPagination: () => void;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 10,
  onPageChange,
}: PaginationHookProps = {}): PaginationHookReturn {
  const [pagination, setPaginationState] = useState<PaginationState>({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState({
    page: initialPage,
    limit: initialLimit,
  });

  const setPagination = useCallback(
    (newPagination: Partial<PaginationState>) => {
      setPaginationState((prev) => ({
        ...prev,
        ...newPagination,
      }));
    },
    []
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
      setPagination({ currentPage: page });
      onPageChange?.(page);
    },
    [onPageChange, setPagination]
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      setFilters((prev) => ({ ...prev, limit, page: 1 }));
      setPagination({ currentPage: 1 });
      onPageChange?.(1);
    },
    [onPageChange, setPagination]
  );

  const resetPagination = useCallback(() => {
    const resetState = {
      currentPage: initialPage,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
    setPaginationState(resetState);
    setFilters({ page: initialPage, limit: initialLimit });
    onPageChange?.(initialPage);
  }, [initialPage, initialLimit, onPageChange]);

  return {
    pagination,
    filters,
    setPagination,
    handlePageChange,
    handleLimitChange,
    resetPagination,
  };
}
