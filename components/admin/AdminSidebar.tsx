'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Trophy,
  Dumbbell,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';
import AdminStatusBadge from './ui/AdminStatusBadge';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: 'Users Directory',
    href: '/admin/users',
    icon: Users,
    badge: null,
  },
  {
    label: 'Items Catalog',
    href: '/admin/catalog/items',
    icon: Package,
    badge: null,
  },
  {
    label: 'Reward Roadmaps',
    href: '/admin/catalog/rewards',
    icon: Trophy,
    badge: null,
  },
  {
    label: 'Preset Splits',
    href: '/admin/catalog/presets',
    icon: Dumbbell,
    badge: null,
  },
  {
    label: 'Audit Trail Logs',
    href: '/admin/audit-logs',
    icon: ScrollText,
    badge: null,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { adminUser } = useAdmin();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gymgit_admin_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymgit_admin_sidebar_collapsed', String(next));
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-zinc-950/95 backdrop-blur-2xl border-r border-zinc-800/80 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-neon-green to-neon-cyan flex items-center justify-center text-zinc-950 font-black text-sm shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                <Shield className="w-4 h-4 text-zinc-950 fill-zinc-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white tracking-wider">GYM-GIT</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan">
                    ADMIN
                  </span>
                </div>
              </div>
            </Link>
          )}

          {collapsed && (
            <div className="mx-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-neon-green to-neon-cyan flex items-center justify-center text-zinc-950 font-black text-sm shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                <Shield className="w-4 h-4 text-zinc-950 fill-zinc-950" />
              </div>
            </div>
          )}

          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-zinc-900 border border-neon-cyan/40 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 hover:border hover:border-zinc-800'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-neon-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-neon-cyan' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Quick Link to App */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-neon-green hover:bg-neon-green/10 border border-transparent hover:border-neon-green/30 transition-all group"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-zinc-500 group-hover:text-neon-green" />
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Athlete App</span>
              <Sparkles className="w-3 h-3 text-neon-green opacity-80" />
            </div>
          )}
        </Link>

        {/* Current Admin Identity Card */}
        {adminUser && !collapsed && (
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{adminUser.name || 'Admin'}</p>
              <p className="text-[10px] text-zinc-500 truncate font-mono">{adminUser.email}</p>
            </div>
            <AdminStatusBadge role={adminUser.role} variant="role" size="sm" />
          </div>
        )}
      </div>
    </aside>
  );
}

export default AdminSidebar;

