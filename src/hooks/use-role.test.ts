import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRole } from './use-role';

describe('useRole', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('defaults to no role and no write access', async () => {
    const { result } = renderHook(() => useRole());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe('');
    expect(result.current.canWrite).toBe(false);
  });

  it.each(['ADMIN', 'MANAGER'] as const)('%s can write', async (role) => {
    sessionStorage.setItem('user', JSON.stringify({ role }));

    const { result } = renderHook(() => useRole());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe(role);
    expect(result.current.canWrite).toBe(true);
  });

  it('EMPLOYEE cannot write', async () => {
    sessionStorage.setItem('user', JSON.stringify({ role: 'EMPLOYEE' }));

    const { result } = renderHook(() => useRole());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.canWrite).toBe(false);
  });

  it('survives malformed stored JSON', async () => {
    sessionStorage.setItem('user', '{oops');

    const { result } = renderHook(() => useRole());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe('');
    expect(result.current.canWrite).toBe(false);
  });

  it('treats a stored user without a role as roleless', async () => {
    sessionStorage.setItem('user', JSON.stringify({ name: 'X' }));

    const { result } = renderHook(() => useRole());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe('');
  });
});
