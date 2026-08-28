'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import AdminEmptyState from './AdminEmptyState';

export interface AdminColumn<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: AdminColumn<T>[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  keyExtractor: (item: T) => string;
}

export function AdminDataTable<T>({
  data,
  columns,
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching the current criteria.',
  onRowClick,
  sortBy,
  sortDir,
  onSort,
  keyExtractor,
}: AdminDataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/90 flex gap-4">
          {columns.map((col, idx) => (
            <div key={idx} className="h-4 bg-zinc-800/60 rounded animate-pulse" style={{ width: col.width || '100px' }} />
          ))}
        </div>
        <div className="divide-y divide-zinc-800/60">
          {[...Array(5)].map((_, rIdx) => (
            <div key={rIdx} className="p-4 flex gap-4 items-center">
              {columns.map((col, cIdx) => (
                <div
                  key={cIdx}
                  className="h-4 bg-zinc-800/40 rounded animate-pulse"
                  style={{ width: col.width || '100px' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 overflow-hidden shadow-xl">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-900/95 border-b border-zinc-800 text-zinc-400 font-semibold tracking-wider uppercase text-[11px]">
              {columns.map((col) => {
                const isCurrentSort = sortBy === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`py-3.5 px-4 select-none ${col.sortable && onSort ? 'cursor-pointer hover:text-white transition-colors' : ''} ${col.className || ''}`}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-zinc-600">
                          {isCurrentSort ? (
                            sortDir === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-neon-cyan" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-neon-cyan" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {data.map((item) => {
              const rowKey = keyExtractor(item);
              const isClickable = !!onRowClick;

              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors duration-150 ${
                    isClickable
                      ? 'cursor-pointer hover:bg-zinc-800/50 hover:text-white'
                      : 'hover:bg-zinc-800/30'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`py-3.5 px-4 align-middle ${col.className || ''}`}>
                      {col.render
                        ? col.render(item)
                        : ((item as Record<string, unknown>)[col.key] as React.ReactNode) ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDataTable;

