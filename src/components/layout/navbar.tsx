'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface NavbarProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

interface UserInfo {
  name: string;
  email: string;
  role: string;
}

export const Navbar = ({
  onMenuClick,
  showUserMenu = true,
}: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  // Breadcrumb from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = seg.charAt(0).toUpperCase() + seg.slice(1);
    return { href, label };
  });

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-5 gap-4"
      style={{
        background: 'rgba(13,13,18,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
          {breadcrumb.map((seg, i) => (
            <span key={seg.href} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && <span className="text-text-muted">/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="font-medium text-text-primary truncate">{seg.label}</span>
              ) : (
                <Link href={seg.href} className="text-text-muted hover:text-text-secondary transition-colors truncate">
                  {seg.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        {showUserMenu && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-text-muted hover:bg-surface-2 hover:text-text-primary transition-colors"
            >
              <div
                className="h-7 w-7 flex items-center justify-center rounded-full text-xs font-semibold text-surface-0"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {initials}
              </div>
              <span className="hidden md:inline font-medium text-text-primary">{user?.name ?? 'User'}</span>
              <svg className="h-3.5 w-3.5 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 mt-1.5 w-56 rounded-xl border py-1 shadow-lg"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--border-default)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-sm font-semibold text-text-primary">{user?.name ?? 'User'}</p>
                  <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
                  {user?.role && (
                    <span className="mt-1.5 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400">
                      {user.role}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error/8 transition-colors text-left"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
