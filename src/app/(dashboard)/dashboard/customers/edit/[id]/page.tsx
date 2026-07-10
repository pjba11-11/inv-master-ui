'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { FormSkeleton } from '@/components/ui/skeleton';
import { CustomerForm } from '@/components/forms/customer-form';
import { useParams, useRouter } from 'next/navigation';

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setCustomer(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
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
          email: customer.email,
          phone: customer.phone,
          gstNumber: customer.gstNumber,
          billingAddress: customer.billingAddress,
          shippingAddress: customer.shippingAddress,
        }}
        isEditMode={true}
      />
    </div>
  );
}
