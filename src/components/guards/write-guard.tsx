'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/use-role';

export function WriteGuard({ children, redirectTo }: { children: React.ReactNode; redirectTo: string }) {
  const { canWrite, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !canWrite) router.replace(redirectTo);
  }, [loading, canWrite]);

  if (loading || !canWrite) return null;
  return <>{children}</>;
}
