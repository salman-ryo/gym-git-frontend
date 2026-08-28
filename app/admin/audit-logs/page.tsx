'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ScrollText,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  Shield,
  X,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AdminAuditLog } from '@/lib/admin-types';
import AdminDataTable, { AdminColumn } from '@/components/admin/ui/AdminDataTable';
import AdminPagination from '@/components/admin/ui/AdminPagination';
import AdminJsonViewer from '@/components/admin/ui/AdminJsonViewer';
import CyberpunkLoader from '@/components/CyberpunkLoader';

const ACTION_OPTIONS = [
  'ALL',
  'INVENTORY_GRANT',
  'INVENTORY_DEDUCT',
  'STREAK_OVERRIDE',
  'STREAK_FREEZE',
  'STREAK_UNFREEZE',
  'USER_STATUS_UPDATE',
  'USER_ROLE_UPDATE',
  'ITEM_CREATE',
  'ITEM_UPDATE',
  'ITEM_DELETE',
  'REWARD_PLAN_CREATE',
  'REWARD_MILESTONE_UPSERT',
  'REWARD_CLAIM_GRANT',
  'REWARD_CLAIM_REVOKE',
  'USER_DEMO_RESET',
  'USER_PURGE',
];

const TARGET_TYPE_OPTIONS = ['ALL', 'USER', 'ITEM', 'REWARD_PLAN', 'PRESET_PLAN'];

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [targetTypeFilter, setTargetTypeFilter] = useState('ALL');
  const [targetIdSearch, setTargetIdSearch] = useState('');
  const [debouncedTargetId, setDebouncedTargetId] = useState('');

  // Selected Log for JSON Metadata Viewer
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTargetId(targetIdSearch);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetIdSearch]);

  const fetchLogs = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const data = await adminService.getAuditLogs({
        page,
        limit,
        action: actionFilter !== 'ALL' ? actionFilter : undefined,
        target_type: targetTypeFilter !== 'ALL' ? targetTypeFilter : undefined,
        target_id: debouncedTargetId.trim() || undefined,
      });
      setLogs(data);
    } catch (err) {
      console.error('[AuditLogs] Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, actionFilter, targetTypeFilter, debouncedTargetId]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await adminService.getAuditLogs({
          page,
          limit,
          action: actionFilter !== 'ALL' ? actionFilter : undefined,
          target_type: targetTypeFilter !== 'ALL' ? targetTypeFilter : undefined,
          target_id: debouncedTargetId.trim() || undefined,
        });
        if (isMounted) setLogs(data);
      } catch (err) {
        console.error('[AuditLogs] Failed to fetch audit logs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [page, limit, actionFilter, targetTypeFilter, debouncedTargetId]);

  const getActionBadge = (action: string) => {
    if (action.includes('GRANT') || action.includes('CREATE') || action.includes('UNFREEZE')) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold tracking-wider">
          {action}
        </span>
      );
    }
    if (action.includes('OVERRIDE') || action.includes('UPDATE') || action.includes('FREEZE')) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold tracking-wider">
          {action}
        </span>
      );
    }
    if (action.includes('DELETE') || action.includes('REVOKE') || action.includes('PURGE') || action.includes('DEDUCT') || action.includes('RESET')) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold tracking-wider">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold tracking-wider">
        {action}
      </span>
    );
  };

  const columns: AdminColumn<AdminAuditLog>[] = [
    {
      key: 'created_at',
      header: 'Timestamp',
      width: '180px',
      render: (item) => (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</span>
        </div>
      ),
    },
    {
      key: 'admin',
      header: 'Admin Identity',
      width: '200px',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
          <span className="font-mono text-xs text-white truncate">
            {item.admin_email || item.admin_id}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      width: '220px',
      render: (item) => getActionBadge(item.action),
    },
    {
      key: 'target',
      header: 'Target Entity',
      render: (item) => (
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 font-bold">
            {item.target_type}
          </span>
          {item.target_type === 'USER' ? (
            <Link
              href={`/admin/users/${item.target_id}`}
              className="text-neon-cyan hover:underline truncate max-w-xs font-semibold"
            >
              {item.target_id}
            </Link>
          ) : (
            <span className="text-zinc-300 truncate max-w-xs">{item.target_id}</span>
          )}
        </div>
      ),
    },
    {
      key: 'metadata',
      header: 'Payload',
      width: '100px',
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLog(item);
          }}
          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-neon-cyan/40 text-zinc-300 hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1.5"
        >
          <Eye className="w-3 h-3 text-neon-cyan" />
          <span>Inspect</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Tamper-proof immutable records of all operational overrides, item grants, status updates, and catalog changes
          </p>
        </div>

        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-cyan' : ''}`} />
          <span>Sync Audit Stream</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Target ID Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={targetIdSearch}
            onChange={(e) => setTargetIdSearch(e.target.value)}
            placeholder="Filter by Target UUID or Identifier..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-neon-cyan rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none placeholder:text-zinc-600 font-mono"
          />
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Action"
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neon-cyan"
          >
            {ACTION_OPTIONS.map((act) => (
              <option key={act} value={act}>
                {act === 'ALL' ? 'All Action Types' : act}
              </option>
            ))}
          </select>
        </div>

        {/* Target Type Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={targetTypeFilter}
            onChange={(e) => {
              setTargetTypeFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Target Entity"
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neon-cyan"
          >
            {TARGET_TYPE_OPTIONS.map((tt) => (
              <option key={tt} value={tt}>
                {tt === 'ALL' ? 'All Target Entities' : tt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <div className="py-20">
          <CyberpunkLoader text="Streaming Immutable Audit Trail" />
        </div>
      ) : (
        <div className="space-y-4">
          <AdminDataTable
            data={logs}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyTitle="No Audit Records Found"
            emptyDescription="No administrative events matched the selected filter criteria."
          />

          <AdminPagination
            currentPage={page}
            totalPages={Math.ceil(logs.length / limit) || 1}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      )}

      {/* JSON Metadata Payload Viewer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <ScrollText className="w-5 h-5 text-neon-cyan" />
                  <span>Audit Record Inspection</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Log ID: <span className="text-zinc-300">{selectedLog.id}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Admin Caller:</span>
                <span className="text-white font-bold">{selectedLog.admin_email || selectedLog.admin_id}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Action:</span>
                <span className="text-neon-cyan font-bold">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Target Type:</span>
                <span className="text-purple-300 font-bold">{selectedLog.target_type}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Target ID:</span>
                <span className="text-zinc-300 truncate block">{selectedLog.target_id}</span>
              </div>
            </div>

            <div>
              <AdminJsonViewer
                data={selectedLog.metadata || {}}
                title="Structured Audit Metadata & State Diff"
                maxHeight="max-h-80"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
