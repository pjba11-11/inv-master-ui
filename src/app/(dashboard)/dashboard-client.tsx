'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

interface DashboardClientProps {
  children: React.ReactNode;
  navItems: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    activeOnly?: boolean;
  }>;
}

export default function DashboardClient({
  children,
  navItems
}: DashboardClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        navItems={navItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar
          leftItems={[
            { label: 'Dashboard', href: '/dashboard' }
          ]}
          rightItems={[
            { label: 'Profile', href: '/dashboard/profile' },
            { label: 'Settings', href: '/dashboard/settings' }
          ]}
          showSearch={true}
          showNotifications={true}
          showUserMenu={true}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-surface-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}