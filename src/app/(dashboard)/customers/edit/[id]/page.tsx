'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { CustomerForm } from '@/components/forms/customer-form';
import { useForm } from '@/components/forms/use-form';
import { useParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';

// Mock data - in a real app, this would come from an API
let mockCustomers = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'info@acme.com',
    phone: '+1 (555) 123-4567',
    gstNumber: 'GSTIN1234567890',
    billingAddress: '123 Business Street',
    billingCity: 'New York',
    billingState: 'NY',
    billingPostalCode: '10001',
    billingCountry: 'USA',
    shippingAddress: '123 Business Street',
    shippingCity: 'New York',
    shippingState: 'NY',
    shippingPostalCode: '10001',
    shippingCountry: 'USA',
    isActive: true
  },
  {
    id: '2',
    name: 'Globex Corporation',
    email: 'contact@globex.com',
    phone: '+1 (555) 987-6543',
    gstNumber: 'GSTIN0987654321',
    billingAddress: '456 Corporate Avenue',
    billingCity: 'Los Angeles',
    billingState: 'CA',
    billingPostalCode: '90210',
    billingCountry: 'USA',
    shippingAddress: '456 Corporate Avenue',
    shippingCity: 'Los Angeles',
    shippingState: 'CA',
    shippingPostalCode: '90210',
    shippingCountry: 'USA',
    isActive: true
  }
];

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [customer, setCustomer] = useState(null);
  const [customers, setCustomersState] = useState(mockCustomers);

  useEffect(() => {
    const cust = mockCustomers.find(c => c.id === id);
    setCustomer(cust || null);
  }, [id]);

  if (!customer) {
    // If customer not found, redirect to list
    router.push('/dashboard/customers');
    return null;
  }

  const handleSubmit = async (data: any) => {
    startTransition(() => {
      // Simulate API call
      const updatedCustomers = customers.map(c =>
        c.id === id ? { ...c, ...data } : c
      );
      setCustomersState(updatedCustomers);
      setCustomer(prev => prev ? { ...prev, ...data } : prev);
    });
    // After transition, redirect to list page
    router.push('/dashboard/customers');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Customer"
        description={`Editing customer: ${customer?.name}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Edit Customer', href: `/dashboard/customers/edit/${id}` }
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>
          Back to Customers
        </Button>
      </PageHeader>

      <div className="grid">
        <div className="col-span-1">
          <CustomerForm
            onSubmit={handleSubmit}
            initialData={customer}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
}