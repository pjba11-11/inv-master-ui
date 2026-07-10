'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatCard } from '@/components/widgets/stat-card';
import { RevenueChart } from '@/components/widgets/revenue-chart';
import { InvoicesTable } from '@/components/widgets/invoices-table';
import { Button } from '@/components/ui/button';

interface ApiInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  grandTotal: number;
  status: string;
}

function mapStatus(s: string): 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' {
  if (s === 'PAID') return 'paid';
  if (s === 'CANCELLED') return 'overdue';
  return 'sent';
}

export default function DashboardPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);

  useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.ok ? r.json() : { invoices: [] })
      .then(data => setInvoices(Array.isArray(data.invoices) ? data.invoices.slice(0, 5) : []))
      .catch(() => {});
  }, []);

  const totalRevenue = invoices.reduce((s, inv) => s + Number(inv.grandTotal), 0);
  const paidCount = invoices.filter(i => i.status === 'PAID').length;
  const outstanding = invoices.filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED')
    .reduce((s, i) => s + Number(i.grandTotal), 0);

  const tableInvoices = invoices.map(inv => ({
    id: String(inv.id),
    number: inv.invoiceNumber,
    date: inv.invoiceDate,
    customerName: inv.customerName || '—',
    amount: Number(inv.grandTotal),
    status: mapStatus(inv.status),
  }));

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Invoices" value={String(invoices.length)} color="primary" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`} color="success" />
        <StatCard title="Outstanding" value={`₹${outstanding.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`} color="warning" />
        <StatCard title="Paid" value={String(paidCount)} color="info" />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart placeholder */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-surface-1 via-surface-1 to-surface-2 rounded-xl border border-surface-2 p-6 shadow-lg hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/5 to-transparent pointer-events-none rounded-xl" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-6 text-text-primary">Monthly Revenue</h3>
            <RevenueChart data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Revenue',
                data: [1200, 1900, 3000, 2500, 2800, 3200],
                borderColor: 'rgb(255, 176, 38)',
                backgroundColor: 'rgba(255, 176, 38, 0.1)',
                tension: 0.3,
              }],
            }} />
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="relative overflow-hidden bg-gradient-to-br from-surface-1 via-surface-2 to-surface-3 rounded-xl border border-surface-2 p-6 shadow-lg hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/3 via-transparent to-transparent pointer-events-none rounded-xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-primary">Recent Invoices</h3>
                <p className="text-sm text-text-muted">Last {tableInvoices.length} invoices</p>
              </div>
              <Link href="/dashboard/invoices/create">
                <Button variant="primary" size="sm">New Invoice</Button>
              </Link>
            </div>
            <InvoicesTable
              invoices={tableInvoices}
              onSelectInvoice={id => router.push(`/dashboard/invoices/${id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
