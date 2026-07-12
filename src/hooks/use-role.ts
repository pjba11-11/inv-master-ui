'use client';

import { useEffect, useState } from 'react';

export type AppRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | '';

export function useRole() {
  const [role, setRole] = useState<AppRole>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('user');
      if (stored) setRole((JSON.parse(stored).role as AppRole) ?? '');
    } catch {}
    setLoading(false);
  }, []);

  const canWrite = role === 'ADMIN' || role === 'MANAGER';

  return { role, canWrite, loading };
}
