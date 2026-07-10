'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Customer {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  billingAddress: string;
  deletedAt: string | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then(r => r.json())
      .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm) ||
    (c.gstNumber || '').includes(searchTerm)
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this customer?')) return;
    await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <div className="text-center py-8 text-text-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer information"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/customers/add">
            <Button variant="primary">Add Customer</Button>
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

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Customer List</h2>
          </div>
          {filtered.length > 0 ? (
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
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-surface-1">
                    <td className="px-4 py-4 text-text-primary font-medium">{c.customerName}</td>
                    <td className="px-4 py-4 text-text-primary">{c.email || '—'}</td>
                    <td className="px-4 py-4 text-text-primary">{c.phone || '—'}</td>
                    <td className="px-4 py-4 text-text-primary">{c.gstNumber || '—'}</td>
                    <td className="px-4 py-4 text-sm space-x-2">
                      <Link href={`/dashboard/customers/${c.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/dashboard/customers/edit/${c.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
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
  );
}
