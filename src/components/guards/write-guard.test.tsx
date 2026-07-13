import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { WriteGuard } from './write-guard';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

describe('WriteGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    replaceMock.mockClear();
  });

  it('renders children for an ADMIN', async () => {
    sessionStorage.setItem('user', JSON.stringify({ role: 'ADMIN' }));

    render(
      <WriteGuard redirectTo="/dashboard/materials">
        <p>secret form</p>
      </WriteGuard>,
    );

    await waitFor(() => expect(screen.getByText('secret form')).toBeInTheDocument());
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('redirects an EMPLOYEE and renders nothing', async () => {
    sessionStorage.setItem('user', JSON.stringify({ role: 'EMPLOYEE' }));

    render(
      <WriteGuard redirectTo="/dashboard/materials">
        <p>secret form</p>
      </WriteGuard>,
    );

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/dashboard/materials'));
    expect(screen.queryByText('secret form')).not.toBeInTheDocument();
  });

  it('redirects when no user is stored', async () => {
    render(
      <WriteGuard redirectTo="/login">
        <p>secret form</p>
      </WriteGuard>,
    );

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('secret form')).not.toBeInTheDocument();
  });
});
