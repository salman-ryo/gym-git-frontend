'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
}: AdminPaginationProps) {
  if (totalPages <= 1 && (!totalCount || totalCount <= limit)) {
    return null;
  }

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = totalCount ? Math.min(currentPage * limit, totalCount) : currentPage * limit;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-zinc-400">
      {/* Total Count Summary */}
      <div className="flex items-center gap-2">
        {totalCount !== undefined ? (
          <span>
            Showing <strong className="text-white">{startItem}</strong> to{' '}
            <strong className="text-white">{endItem}</strong> of{' '}
            <strong className="text-white">{totalCount.toLocaleString()}</strong> results
          </span>
        ) : (
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </span>
        )}

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-zinc-800">
            <span className="text-zinc-500">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Rows per page"
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-neon-cyan text-xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="px-3 py-1 text-xs font-semibold text-zinc-300">
          {currentPage} / {totalPages || 1}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AdminPagination;

