'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';

// Mock data - in a real app, this would come from an API
const mockCustomers = [
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

export default function CustomerViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const cust = mockCustomers.find(c => c.id === id);
    setCustomer(cust || null);
  }, [id]);

  if (!customer) {
    // If customer not found, redirect to list
    router.push('/dashboard/customers');
    return null;
  }

  const {
    name,
    email,
    phone,
    gstNumber,
    billingAddress,
    billingCity,
    billingState,
    billingPostalCode,
    billingCountry,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPostalCode,
    shippingCountry,
    isActive
  } = customer;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Details"
        description={`Viewing customer: ${name}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Customer Details', href: `/dashboard/customers/${id}` }
        ]}
      >
        <div className="flex justify-between items-start">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Customers
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/customers/edit/${id}`)}
          >
            Edit Customer
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        {/* Customer Info Card */}
        <Card className="col-span-1 md:col-span-2">
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-text-muted">Customer Name</p>
                <p className="text-text-primary">{name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-text-muted">Email</p>
                <p className="text-text-primary">{email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-text-muted">Phone</p>
                <p className="text-text-primary">{phone}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-text-muted">GST Number</p>
                <p className="text-text-primary">{gstNumber}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-text-muted">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Addresses Card */}
        <Card className="col-span-1 md:col-span-2">
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Addresses</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Billing Address</h3>
                <p className="text-text-muted">{billingAddress}</p>
                <p className="text-text-muted">{billingCity}, {billingState} {billingPostalCode}</p>
                <p className="text-text-muted">{billingCountry}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Shipping Address</h3>
                <p className="text-text-muted">{shippingAddress}</p>
                <p className="text-text-muted">{shippingCity}, {shippingState} {shippingPostalCode}</p>
                <p className="text-text-muted">{shippingCountry}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}