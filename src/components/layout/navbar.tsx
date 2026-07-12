'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname();

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

    </header>
  );
};
