'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  navItems: NavItem[];
}

export const Sidebar = ({ isOpen = true, onToggle, navItems }: SidebarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col
          border-r bg-surface-1 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 px-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500">
            <svg className="h-4 w-4 text-surface-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-semibold text-text-primary tracking-tight">InvoiceGen</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Menu</p>
          {navItems.map((item, i) => {
            const active = isActive(item.href);
            return (
              <Link
                key={i}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
                  ${active
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text-primary'
                  }`}
              >
                {active && (
                  <span className="absolute left-0 inset-y-1.5 w-0.5 rounded-r bg-primary-500" />
                )}
                <span className={`shrink-0 ${active ? 'text-primary-400' : 'text-text-muted group-hover:text-text-secondary'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer hint */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11px] text-text-muted">Mock data — backend ready</p>
        </div>
      </aside>
    </>
  );
};
