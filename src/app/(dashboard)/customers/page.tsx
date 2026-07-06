'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.gstNumber.includes(searchTerm)
  );

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
      alert('Customer deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer information"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' }
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/customers/add">
            <Button variant="primary">
              Add Customer
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <Card>
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Customer List</h2>
            </div>
            {filteredCustomers.length > 0 ? (
              <table className="w-full border-spacing-0">
                <thead>
                  <tr className="bg-surface-2">
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">GST Number</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2">
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-surface-1">
                      <td className="px-4 py-4 text-text-primary">{customer.name}</td>
                      <td className="px-4 py-4 text-text-primary">{customer.email}</td>
                      <td className="px-4 py-4 text-text-primary">{customer.phone}</td>
                      <td className="px-4 py-4 text-text-primary">{customer.gstNumber || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm space-x-2">
                        <Link href={`/dashboard/customers/${customer.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/customers/edit/${customer.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">No customers found</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}