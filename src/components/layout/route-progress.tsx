'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const RouteProgress = () => {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPath = useRef(pathname);

  const start = () => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.opacity = '1';
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      bar.style.transition = 'width 600ms cubic-bezier(0.1, 0.4, 0.3, 1)';
      bar.style.width = '80%';
    });
  };

  const finish = () => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = 'width 200ms ease-out, opacity 300ms ease 200ms';
    bar.style.width = '100%';
    timerRef.current = setTimeout(() => {
      if (barRef.current) barRef.current.style.opacity = '0';
    }, 200);
  };

  // Start on link click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;
      start();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Finish on pathname change
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      finish();
    }
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        width: '0%',
        opacity: 0,
        background: 'var(--gradient-primary)',
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 0 8px var(--primary-400)',
      }}
    />
  );
};
