'use client';

import { useState, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Login failed');
        setLoading(false);
        return;
      }

      sessionStorage.setItem('user', JSON.stringify(data.user));
      const from = searchParams.get('from') ?? '/dashboard';
      router.push(from);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--surface-0)' }}
    >
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(230,155,29,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-11 w-11 flex items-center justify-center rounded-xl"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <svg className="h-5 w-5 text-surface-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">InvoiceGen</h1>
            <p className="text-sm text-text-muted mt-0.5">Sign in to your account</p>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-text-secondary">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-error rounded-lg px-3 py-2.5" style={{ background: 'var(--error-bg)' }}>
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <Button variant="primary" type="submit" disabled={loading} block>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted">
            No account?{' '}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Demo credentials</p>
          {[
            { role: 'Admin', email: 'admin@example.com', pass: 'admin123' },
            { role: 'Manager', email: 'manager@example.com', pass: 'manager123' },
            { role: 'Employee', email: 'employee@example.com', pass: 'employee123' },
          ].map(c => (
            <button
              key={c.role}
              type="button"
              onClick={() => { setEmail(c.email); setPassword(c.pass); setError(''); }}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-surface-3 transition-colors"
            >
              <span className="text-xs font-medium text-text-secondary">{c.role}</span>
              <span className="text-xs text-text-muted">{c.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
