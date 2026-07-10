'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DetailSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';

interface CompanyDetail {
  id: number;
  companyName: string;
  gstNumber: string;
  phone: string;
  email: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  logoUrl: string;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className="text-text-primary">{value || '—'}</p>
    </div>
  );
}

export default function CompaniesPage() {
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setError(''); setLoading(true);
    fetch('/api/companies')
      .then(r => r.ok ? r.json() : null)
      .then(data => { setCompany(data); setLoading(false); })
      .catch(() => { setError('Failed to load company profile.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="space-y-6">
      <PageHeader title="Company Profile" description="Your company information" />
      <DetailSkeleton fields={8} />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Your registered company information"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Company', href: '/dashboard/companies' },
        ]}
      >
        <Link href="/dashboard/settings">
          <Button variant="primary">Edit in Settings</Button>
        </Link>
      </PageHeader>

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">General</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Company Name" value={company?.companyName} />
            <Field label="GST Number" value={company?.gstNumber} />
            <Field label="Email" value={company?.email} />
            <Field label="Phone" value={company?.phone} />
            <Field label="Address" value={company?.address} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Banking Details</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Bank Name" value={company?.bankName} />
            <Field label="Account Number" value={company?.accountNumber} />
            <Field label="IFSC Code" value={company?.ifsc} />
            <Field label="UPI ID" value={company?.upiId} />
          </div>
        </div>
      </Card>
    </div>
  );
}
