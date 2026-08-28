'use client';

import React, { useState } from 'react';
import {
  Dumbbell,
  Clock,
  RotateCcw,
  Calendar,
  FileText,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AdminUserDetail } from '@/lib/admin-types';
import { GymLog } from '@/lib/types';
import AdminDataTable, { AdminColumn } from '@/components/admin/ui/AdminDataTable';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';

interface LogsTabProps {
  userDetail: AdminUserDetail;
  onRefresh: () => Promise<void>;
}

export function LogsTab({ userDetail, onRefresh }: LogsTabProps) {
  const { user } = userDetail;
  const logs: GymLog[] = userDetail.recent_logs || [];

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetDemo = async () => {
    try {
      setResetLoading(true);
      await adminService.resetUserDemo(user.id);
      setIsResetOpen(false);
      await onRefresh();
    } catch (err) {
      console.error('[LogsTab] Reset demo failed:', err);
    } finally {
      setResetLoading(false);
    }
  };

  const columns: AdminColumn<GymLog>[] = [
    {
      key: 'date',
      header: 'Date',
      width: '140px',
      render: (item) => (
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
          <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{item.date}</span>
        </div>
      ),
    },
    {
      key: 'workoutType',
      header: 'Workout Split / Category',
      width: '200px',
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-neon-green text-xs font-semibold">
          <Dumbbell className="w-3 h-3 text-neon-green" />
          {item.workoutType}
        </span>
      ),
    },
    {
      key: 'hours',
      header: 'Duration',
      width: '120px',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>{item.hours} hrs</span>
        </div>
      ),
    },
    {
      key: 'notes',
      header: 'Athlete Workout Notes',
      render: (item) => (
        <div className="flex items-start gap-1.5 text-zinc-400 text-xs line-clamp-2 max-w-md">
          {item.notes ? (
            <>
              <FileText className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
              <span>{item.notes}</span>
            </>
          ) : (
            <span className="italic text-zinc-600">No notes recorded</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-neon-green" />
            Workout Log History ({userDetail.total_workouts || logs.length} Sessions)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Chronological audit of all workout sessions logged in this athlete&apos;s wall-clock timezone
          </p>
        </div>

        <button
          onClick={() => setIsResetOpen(true)}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-950/20 transition-all text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Demo History</span>
        </button>
      </div>

      {/* Workout Logs Table */}
      <AdminDataTable
        data={logs}
        columns={columns}
        keyExtractor={(item) => item.id || item.date}
        emptyTitle="No Workout History"
        emptyDescription="This athlete has not logged any workouts yet."
      />

      {/* Reset Demo History Modal */}
      <AdminConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetDemo}
        loading={resetLoading}
        title="Reset Workout History to Demo Seed"
        description="Are you sure you want to purge current workout logs and reset this athlete's history to demo seeds? Current streak calculations will be recalculated."
        variant="warning"
        confirmText="Reset Workout History"
      />
    </div>
  );
}

