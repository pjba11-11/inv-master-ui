import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  activeOnly?: boolean;
}

interface NavbarProps {
  leftItems?: NavItem[];
  rightItems?: NavItem[];
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

export const Navbar = ({
  leftItems = [],
  rightItems = [],
  showSearch = true,
  showNotifications = true,
  showUserMenu = true
}: NavbarProps) => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleLogout = () => {
    // Implement logout logic
    // For now, just redirect to login
    // In a real app, you'd use next/navigation's useRouter or usePathname with redirect
    // For client components, we can use window.location.href or a custom solution
    // For simplicity, we'll just show an alert for now
    alert('Logout functionality would be implemented here');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-surface-2 bg-gradient-to-r from-surface-1 via-surface-1 to-surface-2 shadow-md">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - App name/brand and navigation */}
        <div className="flex items-center space-x-6">
          {/* App Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center bg-primary-100 rounded-md">
              {/* Logo icon */}
              <svg className="h-5 w-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2a.5.5 0 01 .5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm0 4a.5.5 0 01 .5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5z" />
              </svg>
            </div>
            <span className="font-semibold text-xl">InvoiceGen</span>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            {leftItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`${[
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium',
                  'transition-colors',
                  pathname.startsWith(item.href)
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-text-muted hover:bg-surface-3 hover:text-text-primary'
                ].join(' ')}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side - Actions, notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <button
                onClick={handleSearchToggle}
                className="p-1 rounded-md text-text-muted hover:bg-surface-3 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Search dropdown (mobile) */}
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-2 rounded-md shadow-2xl border border-surface-3 z-50">
                  <input
                    type="text"
                    placeholder="Search invoices, customers, products..."
                    className="block w-full px-4 py-2 text-sm text-text-primary bg-surface-2 border-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {showNotifications && (
            <div className="relative group">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1 rounded-md text-text-muted hover:bg-surface-3 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5 6 6 0 10-4 5v3.158a2.032 2.032 0 01-1.405 1.405l-1.295 1.295M15 17H6l2-2" />
                </svg>
                {/* Badge for notifications */}
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-error text-xs font-bold text-white rounded-full">
                  3
                </span>
              </button>

              {/* Notification dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-surface-2 to-surface-3 rounded-lg shadow-2xl border border-surface-3 z-50\">
                  <div className="px-4 py-3 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-3">
                    <p className="text-sm font-medium text-text-primary">Notifications</p>
                  </div>
                  {/* Notification items */}
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-surface-3/50 cursor-pointer transition-colors flex items-start space-x-3 border-b border-surface-3/30">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 rounded-md">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4M7.206 8.406a12.292 12.292 0 013.59-3.304A12.078 12.078 0 0112 3c1.732 0 3.393.53 4.779 1.452a1.018 1.018 0 011.432.016A10.802 10.802 0 0121 12a10.802 10.802 0 01-5.694 4.433A1.018 1.018 0 0116 21a10.802 10.802 0 01-7.73-3.457" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm">New invoice created</p>
                        <p className="text-xs text-text-muted">5 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User menu */}
          {showUserMenu && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-md text-text-muted hover:bg-surface-3 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {/* User avatar */}
                <div className="h-8 w-8 flex items-center justify-center bg-primary-200 rounded-full">
                  <span className="text-primary-500 font-medium text-sm">AD</span>
                </div>
                <span className="hidden md:inline text-sm">Admin User</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-surface-2 to-surface-3 rounded-lg shadow-2xl border border-surface-3 z-50">
                  <div className="px-4 py-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-2/80">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex-shrink-0">
                        <span className="text-white font-semibold">AD</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm">Admin User</p>
                        <p className="text-xs text-text-muted">admin@example.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <button onClick={handleLogout} className="w-full px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-md transition-colors text-left">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};