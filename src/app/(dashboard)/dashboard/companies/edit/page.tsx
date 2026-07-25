'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { DetailSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { WriteGuard } from '@/components/guards/write-guard';
import { CompanyForm, type CompanyFormValues } from '@/components/forms/company-form';

export default function EditCompanyPage() {
  const router = useRouter();
  const [initial, setInitial] = useState<Partial<CompanyFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');

  const load = () => {
    setError(''); setLoading(true);
    fetch('/api/companies')
      .then(r => (r.ok ? r.json() : null))
      .then(data => { setInitial(data ?? {}); setLoading(false); })
      .catch(() => { setError('Failed to load company profile.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (values: CompanyFormValues) => {
    setSaveError('');
    // Backend GET exposes the logo as `logoUrl`; the PUT payload expects `logo`.
    const { logoUrl, ...rest } = values;
    try {
      const res = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, logo: logoUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error ?? data.message ?? 'Failed to save company.');
        return;
      }
      router.push('/dashboard/companies');
    } catch {
      setSaveError('Something went wrong. Please try again.');
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <PageHeader title="Edit Company" description="Update your company profile" />
      <DetailSkeleton fields={8} />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <WriteGuard redirectTo="/dashboard/companies">
      <div className="space-y-6">
        <PageHeader
          title="Edit Company"
          description="Update your company details, banking info, and logo"
          showBreadcrumbs={true}
          breadcrumbItems={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Company', href: '/dashboard/companies' },
            { label: 'Edit', href: '/dashboard/companies/edit' },
          ]}
        />
        {saveError && (
          <div className="text-sm text-error rounded-lg px-4 py-3" style={{ background: 'var(--error-bg, rgba(239,68,68,0.1))' }}>
            {saveError}
          </div>
        )}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <CompanyForm onSubmit={handleSubmit} initialData={initial ?? {}} />
        </div>
      </div>
    </WriteGuard>
  );
}
