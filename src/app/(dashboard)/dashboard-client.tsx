'use client';

import { useState } from 'react';
import { Sidebar, NavSection } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { RouteProgress } from '@/components/layout/route-progress';

interface DashboardClientProps {
  children: React.ReactNode;
  navSections: NavSection[];
}

export default function DashboardClient({ children, navSections }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <RouteProgress />
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={collapsed}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onCollapseToggle={() => setCollapsed(!collapsed)}
        navSections={navSections}
      />
      {/* Main content shifts with sidebar width on desktop */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-14' : 'lg:ml-60'}`}>
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
