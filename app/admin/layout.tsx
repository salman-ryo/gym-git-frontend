'use client';

import React from 'react';
import { AdminProvider, useAdmin } from '@/lib/admin-context';
import { AdminGuard } from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAdmin();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-neon-cyan/20 selection:text-neon-cyan relative overflow-x-hidden">
      {/* Styled JSX to hide root footer on admin panel */}
      <style jsx global>{`
        footer {
          display: none !important;
        }
      `}</style>

      {/* Fixed Collapsible Sidebar */}
      <AdminSidebar />

      {/* Main Workspace Area (Offset by sidebar width and expands/collapses in sync) */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full transition-[padding] duration-300 ease-in-out pl-0 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AdminProvider>
  );
}

