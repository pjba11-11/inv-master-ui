'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
}

export const Breadcrumbs = ({ 
  items = [], 
  showHome = true,
  homeLabel = 'Dashboard',
  homeHref = '/dashboard'
}: BreadcrumbsProps) => {
  const pathname = usePathname();
  
  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [];
  
  if (showHome) {
    breadcrumbItems.push({ label: homeLabel, href: homeHref });
  }
  
  // Add provided items
  breadcrumbItems.push(...items);
  
  // If no items provided, try to derive from path
  if (items.length === 0 && showHome) {
    const pathSegments = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      // Convert kebab-case to Title Case
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbItems.push({ 
        label, 
        href: currentPath 
      });
    });
  }

  return (
    <nav className="flex flex-wrap items-center gap-x-1 text-sm text-text-muted" aria-label="breadcrumb">
      <ol className="inline-flex items-center space-x-4">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.label} className="flex items-center">
              {!isLast ? (
                <Link href={item.href} className="hover:text-text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-primary">{item.label}</span>
              )}
              {!isLast && (
                <span className="mx-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
