import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  activeOnly?: boolean;
}

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  navItems: NavItem[];
}

export const Sidebar = ({
  isOpen = true,
  onToggle,
  navItems
}: SidebarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-surface-2
        bg-gradient-to-b from-surface-1 to-surface-2 transition-all duration-300
        ${isOpen ? '' : '-translate-x-full'}`}
    >
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="-mr-2 flex h-9 w-9 items-center justify-center rounded-md
          text-primary-400 hover:bg-surface-3 hover:text-primary-300
          focus:outline-none focus:ring-2 focus:ring-primary-400 lg:hidden"
        aria-label="Open sidebar"
      >
        {/* Hamburger icon */}
        <span className="sr-only">Open sidebar</span>
      </button>

      <div className="flex-1 overflow-y-auto">
        <nav className="mt-10 space-y-1 px-3">
          {navItems.map((item, index) => {
            const isActiveItem = isActive(item.href);

            return (
              <Link
                key={index}
                href={item.href}
                className={`${[
                  'group flex w-full items-start rounded-md px-3 py-2 text-sm font-medium',
                  'transition-colors',
                  isActiveItem
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-text-muted hover:bg-surface-3 hover:text-text-primary'
                ].join(' ')}`}
              >
                {item.icon && (
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center
                    text-primary-400 group-active:text-primary-500">
                    {item.icon}
                  </span>
                )}
                <span className="ml-3 flex-1">{item.label}</span>
                {!item.activeOnly && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center
                    text-text-muted group-hover:text-text-primary">
                    {/* Chevron icon for submenu */}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="border-t border-surface-2">
        {/* Could add user profile, logout button, etc. here */}
      </div>
    </aside>
  );
};