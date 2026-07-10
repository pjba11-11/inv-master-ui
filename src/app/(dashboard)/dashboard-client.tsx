'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { RouteProgress } from '@/components/layout/route-progress';

interface DashboardClientProps {
  children: React.ReactNode;
  navItems: Array<{ label: string; href: string; icon?: React.ReactNode }>;
}

export default function DashboardClient({ children, navItems }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <RouteProgress />
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        navItems={navItems}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        <Navbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showSearch
          showNotifications
          showUserMenu
        />
        <main className="flex-1 p-6 bg-surface-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
