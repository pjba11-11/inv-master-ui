'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { DetailSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { useParams, useRouter } from 'next/navigation';

interface Customer {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
  createdByName?: string;
}

export default function CustomerViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setCustomer(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  if (loading) return <div className="space-y-6"><PageHeader title="Customer" /><DetailSkeleton fields={6} /></div>;

  if (!customer) {
    router.push('/dashboard/customers');
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Details"
        description={`Viewing: ${customer.customerName}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Customer Details', href: `/dashboard/customers/${id}` },
        ]}
      >
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/customers/edit/${id}`)}>Edit</Button>
        </div>
      </PageHeader>

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Customer Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-text-muted">Customer Name</p>
              <p className="text-text-primary">{customer.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Email</p>
              <p className="text-text-primary">{customer.email || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Phone</p>
              <p className="text-text-primary">{customer.phone || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">GST Number</p>
              <p className="text-text-primary">{customer.gstNumber || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-text-muted">Address</p>
              <p className="text-text-primary whitespace-pre-line">{customer.address || '—'}</p>
            </div>
            {customer.createdByName && (
              <div>
                <p className="text-sm font-medium text-text-muted">Created By</p>
                <p className="text-text-primary">{customer.createdByName}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
