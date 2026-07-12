'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  isOpen?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  onCollapseToggle?: () => void;
  navSections: NavSection[];
}

interface UserInfo { name: string; email: string; role: string; }

const roleBadgeColor: Record<string, string> = {
  ADMIN: 'bg-primary-500/20 text-primary-400',
  MANAGER: 'bg-warning/20 text-warning',
  EMPLOYEE: 'bg-surface-3 text-text-muted',
};

export const Sidebar = ({ isOpen = true, collapsed = false, onToggle, onCollapseToggle, navSections }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = sessionStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  if (!mounted) return null;

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col
          border-r bg-surface-1 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-14' : 'w-60'}`}
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {/* Brand + collapse toggle */}
        <div className="flex h-16 items-center justify-between px-3 border-b shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500">
                <svg className="h-4 w-4 text-surface-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-text-primary tracking-tight">InvoiceGen</span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-primary-500">
              <svg className="h-4 w-4 text-surface-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          {/* Collapse toggle — desktop only */}
          <button
            onClick={onCollapseToggle}
            className={`hidden lg:flex items-center justify-center h-7 w-7 rounded-md text-text-muted hover:bg-surface-2 hover:text-text-primary transition-colors shrink-0
              ${collapsed ? 'mx-auto' : ''}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
          {navSections.map((section, si) => (
            <div key={si}>
              {!collapsed && (
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {section.label}
                </p>
              )}
              {collapsed && si > 0 && (
                <div className="my-2 mx-2 border-t" style={{ borderColor: 'var(--border-subtle)' }} />
              )}
              <div className="space-y-0.5">
                {section.items.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center rounded-lg transition-all duration-150
                        ${collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5'}
                        text-sm font-medium
                        ${active
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-text-muted hover:bg-surface-2 hover:text-text-primary'
                        }`}
                    >
                      {active && !collapsed && (
                        <span className="absolute left-0 inset-y-1.5 w-0.5 rounded-r bg-primary-500" />
                      )}
                      {active && collapsed && (
                        <span className="absolute inset-0 rounded-lg ring-1 ring-primary-500/40" />
                      )}
                      <span className={`shrink-0 ${active ? 'text-primary-400' : 'text-text-muted group-hover:text-text-secondary'}`}>
                        {item.icon}
                      </span>
                      {!collapsed && item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile footer */}
        <div className="border-t shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <div
                className="h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold text-surface-0 shrink-0"
                style={{ background: 'var(--gradient-primary, linear-gradient(135deg,#6366f1,#8b5cf6))' }}
                title={user ? `${user.name} · ${user.role}` : 'User'}
              >
                {initials}
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="p-3">
              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-surface-2">
                <div
                  className="h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold text-surface-0 shrink-0"
                  style={{ background: 'var(--gradient-primary, linear-gradient(135deg,#6366f1,#8b5cf6))' }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{user?.name ?? 'User'}</p>
                  <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-0.5 ${roleBadgeColor[user?.role ?? ''] ?? 'bg-surface-3 text-text-muted'}`}>
                    {user?.role ?? '—'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
