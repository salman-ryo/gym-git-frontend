'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Clock,
  Save,
  AlertTriangle,
  Trash2,
  Loader2,
  CheckCircle2,
  Ban,
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AdminUserDetail, UserAccountStatus, AdminRole } from '@/lib/admin-types';
import { useAdmin } from '@/lib/admin-context';
import AdminConfirmModal from '@/components/admin/ui/AdminConfirmModal';

interface ProfileTabProps {
  userDetail: AdminUserDetail;
  onRefresh: () => Promise<void>;
}

export function ProfileTab({ userDetail, onRefresh }: ProfileTabProps) {
  const router = useRouter();
  const { isSuperAdmin } = useAdmin();
  const { user } = userDetail;

  // Profile Form States
  const [name, setName] = useState(user.name || '');
  const [timezone, setTimezone] = useState(user.timezone || 'UTC');
  const [weeklyPlanId, setWeeklyPlanId] = useState(user.weekly_plan_id || 'ppl-standard');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Status Modal States
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<UserAccountStatus>('suspended');
  const [statusReason, setStatusReason] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Role Modal States (SuperAdmin)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<AdminRole>(user.role);
  const [roleLoading, setRoleLoading] = useState(false);

  // Purge Modal States (SuperAdmin)
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeLoading, setPurgeLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(false);
    setProfileError(null);

    try {
      await adminService.updateUserProfile(user.id, {
        name: name.trim(),
        timezone: timezone.trim(),
        weekly_plan_id: weeklyPlanId.trim() || undefined,
      });
      setProfileSuccess(true);
      await onRefresh();
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user profile.';
      setProfileError(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setStatusLoading(true);
      await adminService.updateUserStatus(user.id, {
        status: targetStatus,
        reason: statusReason.trim() || undefined,
      });
      setIsStatusModalOpen(false);
      setStatusReason('');
      await onRefresh();
    } catch (err) {
      console.error('[ProfileTab] Status update failed:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    try {
      setRoleLoading(true);
      await adminService.updateUserRole(user.id, {
        role: targetRole,
      });
      setIsRoleModalOpen(false);
      await onRefresh();
    } catch (err) {
      console.error('[ProfileTab] Role update failed:', err);
    } finally {
      setRoleLoading(false);
    }
  };

  const handlePurgeAccount = async () => {
    try {
      setPurgeLoading(true);
      await adminService.purgeUser(user.id);
      router.push('/admin/users');
    } catch (err) {
      console.error('[ProfileTab] Purge account failed:', err);
      setPurgeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Information Editor */}
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
                <User className="w-4 h-4 text-neon-cyan" />
                Athlete Identity & Schedule Settings
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update account display credentials, regional time zones and assigned workout split
              </p>
            </div>

            {profileSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          {profileError && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
              {profileError}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            {/* Email (Readonly) */}
            <div>
              <label className="block font-semibold uppercase text-zinc-400 mb-1">Email Address</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-400 font-mono focus:outline-none cursor-not-allowed opacity-80"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Managed via Supabase Auth identity provider.</p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block font-semibold uppercase text-zinc-400 mb-1">Athlete Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="block font-semibold uppercase text-zinc-400 mb-1">
                Regional Timezone (IANA String)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. America/New_York, Europe/London, Asia/Kolkata"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-neon-cyan rounded-xl pl-9 pr-3.5 py-2.5 text-white font-mono focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Determines the 00:00:00 to 23:59:59 streak calculation window for this athlete.
              </p>
            </div>

            {/* Weekly Plan ID */}
            <div>
              <label className="block font-semibold uppercase text-zinc-400 mb-1">Assigned Weekly Plan ID</label>
              <input
                type="text"
                value={weeklyPlanId}
                onChange={(e) => setWeeklyPlanId(e.target.value)}
                placeholder="e.g. ppl-standard, upper-lower, arnold-split"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-neon-cyan rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="px-5 py-2.5 rounded-xl bg-neon-cyan text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)]"
              >
                {profileLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Account Lifecycle, Roles & Status Actions */}
        <div className="space-y-6">
          {/* Account Status Card */}
          <div className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
              <Ban className="w-4 h-4 text-amber-400" />
              Account Status & Locks
            </h3>
            <p className="text-xs text-zinc-400">
              Manage operational account access and platform permissions for this athlete.
            </p>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-semibold">Current Status:</span>
              <span className="font-bold uppercase text-white font-mono">[{user.status}]</span>
            </div>

            <div className="space-y-2 pt-2">
              {user.status === 'active' ? (
                <>
                  <button
                    onClick={() => {
                      setTargetStatus('suspended');
                      setIsStatusModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Suspend Athlete
                  </button>

                  <button
                    onClick={() => {
                      setTargetStatus('banned');
                      setIsStatusModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Ban Athlete Account
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setTargetStatus('active');
                    setIsStatusModalOpen(true);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Restore / Activate Account
                </button>
              )}
            </div>
          </div>

          {/* SuperAdmin Role & Purge Panel */}
          {isSuperAdmin && (
            <div className="rounded-2xl bg-purple-950/20 border border-purple-500/30 p-6 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-black text-purple-300 tracking-tight uppercase">
                  SuperAdmin Controls
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Elevated administrative capabilities: modify platform roles or permanently purge account data.
              </p>

              <button
                onClick={() => {
                  setTargetRole(user.role);
                  setIsRoleModalOpen(true);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 hover:bg-purple-900/50 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                Change Platform Role ({user.role})
              </button>

              <button
                onClick={() => setIsPurgeModalOpen(true)}
                className="w-full px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Permanently Purge Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Confirmation Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Update Status: <span className="uppercase text-amber-400">{targetStatus}</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Specify the reason for this account status change (recorded in administrative audit logs).
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-400 mb-1">Audit Reason</label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Violation of community terms, support request #1029..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-400 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  disabled={statusLoading}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={statusLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase flex items-center gap-2"
                >
                  {statusLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Status Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal (SuperAdmin) */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-purple-500/40 p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white tracking-tight mb-1">
              Elevate / Demote Platform Role
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Select the administrative authority level to assign to <strong className="text-white">{user.email}</strong>.
            </p>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                {(['user', 'admin', 'superadmin'] as AdminRole[]).map((r) => (
                  <label
                    key={r}
                    onClick={() => setTargetRole(r)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      targetRole === r
                        ? 'bg-purple-950/60 border-purple-500 text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold uppercase block">{r}</span>
                      <span className="text-[10px] text-zinc-500">
                        {r === 'superadmin'
                          ? 'Unrestricted access to all admin tools, role promotion & account purging'
                          : r === 'admin'
                          ? 'Access to catalog, user overrides, audit logs & analytics'
                          : 'Standard athlete mobile/portal access only'}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="role_select"
                      checked={targetRole === r}
                      onChange={() => setTargetRole(r)}
                      className="text-purple-600 focus:ring-0"
                    />
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  disabled={roleLoading}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateRole}
                  disabled={roleLoading}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase flex items-center gap-2"
                >
                  {roleLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Assign Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Purge Modal (SuperAdmin) */}
      <AdminConfirmModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirm={handlePurgeAccount}
        loading={purgeLoading}
        title={`Permanently Purge Athlete: ${user.email}`}
        description="WARNING: This action is irreversible. All workout logs, item inventory, streak history, and Supabase records associated with this athlete will be completely destroyed."
        variant="danger"
        requiredConfirmationPhrase="PURGE"
        confirmText="Destroy Account"
      />
    </div>
  );
}

