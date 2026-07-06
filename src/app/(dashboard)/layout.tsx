import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Invoice Generator - Dashboard',
  description: 'Manage your invoices, customers, and products',
};

// Navigation items for the sidebar
const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: null },
  { label: 'Customers', href: '/dashboard/customers', icon: null },
  { label: 'Products', href: '/dashboard/products', icon: null },
  { label: 'Materials', href: '/dashboard/materials', icon: null },
  { label: 'Invoices', href: '/dashboard/invoices', icon: null },
  { label: 'Reports', href: '/dashboard/reports', icon: null },
  { label: 'Settings', href: '/dashboard/settings', icon: null },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-0 min-h-screen">
      <DashboardClient navItems={navItems}>
        {children}
      </DashboardClient>
    </div>
  );
}