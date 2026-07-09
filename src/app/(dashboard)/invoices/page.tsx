'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/widgets/stat-card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type InvoiceStatus = 'GENERATED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  customerId: number | null;
  subtotal: number;
  cgst: number;
  sgst: number;
  discount: number;
  grandTotal: number;
  status: InvoiceStatus;
  remarks: string;
}

const statusBadge: Record<InvoiceStatus, string> = {
  GENERATED: 'bg-warning/20 text-warning',
  PARTIALLY_PAID: 'bg-primary-500/20 text-primary-500',
  PAID: 'bg-success/20 text-success',
  CANCELLED: 'bg-error/20 text-error',
};

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.json())
      .then(data => { setInvoices(data.invoices ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { title: 'Total', value: invoices.length },
    { title: 'Paid', value: invoices.filter(i => i.status === 'PAID').length },
    { title: 'Outstanding', value: `₹${invoices.filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED').reduce((s, i) => s + i.grandTotal, 0).toFixed(2)}` },
    { title: 'Cancelled', value: invoices.filter(i => i.status === 'CANCELLED').length },
  ];

  if (loading) return <div className="text-center py-8 text-text-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage and track all your invoices"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
        ]}
      >
        <Link href="/dashboard/invoices/create">
          <Button variant="primary">New Invoice</Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} />
        ))}
      </div>

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Invoice List</h2>
          </div>
          {invoices.length > 0 ? (
            <table className="w-full border-spacing-0">
              <thead>
                <tr className="bg-surface-2">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Number</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Grand Total</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-surface-1">
                    <td className="px-4 py-4 text-text-primary font-medium">{inv.invoiceNumber}</td>
                    <td className="px-4 py-4 text-text-primary">{inv.invoiceDate}</td>
                    <td className="px-4 py-4 text-text-primary">₹{Number(inv.grandTotal).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[inv.status]}`}>
                        {inv.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm space-x-2">
                      <Link href={`/dashboard/invoices/${inv.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/dashboard/invoices/${inv.id}/payments`}>
                        <Button variant="outline" size="sm">Payments</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted">No invoices found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
