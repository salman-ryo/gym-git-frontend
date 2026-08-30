'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Flame,
  Dumbbell,
  RefreshCw,
  ExternalLink,
  Filter,
  Shield,
  Clock,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import {
  AdminUserListItem,
  AdminRole,
  UserAccountStatus,
} from '@/lib/admin-types';
import AdminDataTable, { AdminColumn } from '@/components/admin/ui/AdminDataTable';
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge';
import AdminPagination from '@/components/admin/ui/AdminPagination';
import AdminUserAvatar from '@/components/admin/ui/AdminUserAvatar';
import CyberpunkLoader from '@/components/CyberpunkLoader';

export default function AdminUsersPage() {
  const router = useRouter();

  // Query States
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<
    'created_at' | 'email' | 'name' | 'role' | 'status' | 'current_streak' | 'total_workouts' | 'updated_at'
  >('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const data = await adminService.getUsers({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        role: roleFilter,
        status: statusFilter,
        sort_by: sortBy,
        sort_dir: sortDir,
      });
      setUsers(data);
    } catch (err) {
      console.error('[AdminUsers] Failed to fetch users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await adminService.getUsers({
          page,
          limit,
          search: debouncedSearch.trim() || undefined,
          role: roleFilter,
          status: statusFilter,
          sort_by: sortBy,
          sort_dir: sortDir,
        });
        if (isMounted) setUsers(data);
      } catch (err) {
        console.error('[AdminUsers] Failed to load users list:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, roleFilter, statusFilter, sortBy, sortDir]);

  const handleSort = (columnKey: string) => {
    const key = columnKey as typeof sortBy;
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  const columns: AdminColumn<AdminUserListItem>[] = [
    {
      key: 'athlete',
      header: 'Athlete',
      width: '260px',
      render: (item) => {
        const itemRecord = item as unknown as Record<string, unknown>;
        const avatarUrl =
          item.avatar_url ||
          item.avatarUrl ||
          item.avatar ||
          (itemRecord.picture as string | undefined) ||
          (itemRecord.image_url as string | undefined);

        return (
          <div className="flex items-center gap-3">
            <AdminUserAvatar
              src={avatarUrl}
              name={item.name}
              email={item.email}
              size="sm"
              shape="circle"
              className="shadow-[0_0_10px_rgba(0,255,136,0.15)]"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-white tracking-tight truncate">{item.name || 'Unnamed Athlete'}</p>
              <p className="font-mono text-[10px] text-zinc-400 truncate">{item.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'role',
      header: 'Role & Status',
      width: '180px',
      render: (item) => (
        <div className="flex items-center gap-2">
          <AdminStatusBadge role={item.role} variant="role" size="sm" />
          <AdminStatusBadge status={item.status} variant="status" size="sm" />
        </div>
      ),
    },
    {
      key: 'current_streak',
      header: 'Streak',
      sortable: true,
      width: '110px',
      render: (item) => (
        <div className="flex items-center gap-1.5 font-mono">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span className="font-black text-white text-xs">{item.current_streak || 0}</span>
          <span className="text-[10px] text-zinc-500">days</span>
        </div>
      ),
    },
    {
      key: 'total_workouts',
      header: 'Workouts',
      sortable: true,
      width: '110px',
      render: (item) => (
        <div className="flex items-center gap-1.5 font-mono">
          <Dumbbell className="w-3.5 h-3.5 text-neon-green" />
          <span className="font-bold text-white text-xs">{item.total_workouts || 0}</span>
        </div>
      ),
    },
    {
      key: 'timezone',
      header: 'Timezone',
      render: (item) => (
        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span>{item.timezone || 'UTC'}</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      width: '130px',
      render: (item) => {
        const d = item.created_at ? new Date(item.created_at).toLocaleDateString() : '—';
        return <span className="text-zinc-400 text-[11px] font-mono">{d}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Manage',
      width: '100px',
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/users/${item.id}`);
          }}
          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"
        >
          <span>360</span>
          <ExternalLink className="w-3 h-3" />
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
            Athletes & User Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Search athletes, inspect composite profiles, repair streaks, manage roles & audit item inventories
          </p>
        </div>

        <button
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-neon-cyan' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, athlete name, user UUID or Supabase Auth ID..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-neon-cyan rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none placeholder:text-zinc-600 font-medium"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as AdminRole | 'all');
              setPage(1);
            }}
            aria-label="Filter by Role"
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neon-cyan"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as UserAccountStatus | 'all');
              setPage(1);
            }}
            aria-label="Filter by Status"
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neon-cyan"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* User Data Table */}
      {loading ? (
        <div className="py-20">
          <CyberpunkLoader text="Querying Athletes Directory" />
        </div>
      ) : (
        <div className="space-y-4">
          <AdminDataTable
            data={users}
            columns={columns}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => router.push(`/admin/users/${item.id}`)}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            emptyTitle="No Athletes Found"
            emptyDescription="No registered athletes match the current search query or filter parameters."
          />

          <AdminPagination
            currentPage={page}
            totalPages={Math.ceil(users.length / limit) || 1}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
