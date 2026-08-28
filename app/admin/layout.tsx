'use client';

import React from 'react';
import { AdminProvider } from '@/lib/admin-context';
import { AdminGuard } from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGuard>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-neon-cyan/20 selection:text-neon-cyan">
          {/* Fixed Collapsible Sidebar */}
          <AdminSidebar />

          {/* Main Workspace Area (Offset by sidebar width) */}
          <div className="flex-1 flex flex-col pl-20 lg:pl-64 transition-all duration-300">
            <AdminHeader />
            <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
          </div>
        </div>
      </AdminGuard>
    </AdminProvider>
  );
}

