'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
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
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setError(''); setLoading(true);
    fetch('/api/customers')
      .then(r => r.json())
      .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Failed to load customers.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c =>
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm) ||
    (c.gstNumber || '').includes(searchTerm)
  );

  const handleDelete = async (id: number) => {
    setDeleting(true);
    await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    setCustomers(prev => prev.filter(c => c.id !== id));
    setConfirmDeleteId(null);
    setDeleting(false);
  };

  if (loading) return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Manage your customer information">
        <Link href="/dashboard/customers/add"><Button variant="primary">Add Customer</Button></Link>
      </PageHeader>
      <TableSkeleton rows={5} cols={5} />
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={load} />;

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
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/customers/${c.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/dashboard/customers/edit/${c.id}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        {confirmDeleteId === c.id ? (
                          <>
                            <Button variant="destructive" size="sm" loading={deleting} onClick={() => handleDelete(c.id)}>Confirm?</Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                          </>
                        ) : (
                          <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteId(c.id)}>Delete</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title={searchTerm ? 'No results match your search' : 'No customers yet'}
              description={searchTerm ? 'Try a different search term.' : 'Add your first customer to get started.'}
              action={!searchTerm ? <Link href="/dashboard/customers/add"><Button variant="primary" size="sm">Add Customer</Button></Link> : undefined}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
