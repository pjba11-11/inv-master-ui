'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { CustomerForm, CustomerFormValues } from '@/components/forms/customer-form';
import { useRouter } from 'next/navigation';
import { WriteGuard } from '@/components/guards/write-guard';

export default function AddCustomerPage() {
  const router = useRouter();

  const handleSubmit = async (data: CustomerFormValues) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/dashboard/customers');
  };

  return (
    <WriteGuard redirectTo="/dashboard/customers">
    <div className="space-y-6">
      <PageHeader
        title="Add Customer"
        description="Create a new customer record"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Add Customer', href: '/dashboard/customers/add' },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Customers</Button>
      </PageHeader>

      <CustomerForm onSubmit={handleSubmit} isEditMode={false} />
    </div>
    </WriteGuard>
  );
}
