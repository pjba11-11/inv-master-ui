'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { FormSkeleton } from '@/components/ui/skeleton';
import { CustomerForm, CustomerFormValues } from '@/components/forms/customer-form';
import { useParams, useRouter } from 'next/navigation';
import { WriteGuard } from '@/components/guards/write-guard';

interface Customer extends CustomerFormValues {
  id: number;
}

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setCustomer(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: CustomerFormValues) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/dashboard/customers');
  };

  if (loading) return <div className="space-y-6"><PageHeader title="Edit Customer" /><FormSkeleton fields={6} /></div>;
  if (!customer) { router.push('/dashboard/customers'); return null; }

  return (
    <WriteGuard redirectTo="/dashboard/customers">
    <div className="space-y-6">
      <PageHeader
        title="Edit Customer"
        description={`Editing: ${customer.customerName}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Edit Customer', href: `/dashboard/customers/edit/${id}` },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Customers</Button>
      </PageHeader>

      <CustomerForm
        onSubmit={handleSubmit}
        initialData={{
          customerName: customer.customerName,
          email: customer.email ?? '',
          phone: customer.phone ?? '',
          gstNumber: customer.gstNumber ?? '',
          address: customer.address ?? '',
        }}
        isEditMode={true}
      />
    </div>
    </WriteGuard>
  );
}
