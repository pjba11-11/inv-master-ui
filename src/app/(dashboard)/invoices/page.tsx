'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { InvoicesTable } from '@/components/widgets/invoices-table';
import { StatCard } from '@/components/widgets/stat-card';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([
    {
      id: '1',
      number: 'INV-001',
      date: '2023-05-15',
      customerName: 'Acme Corp',
      amount: 1500.00,
      status: 'paid'
    },
    {
      id: '2',
      number: 'INV-002',
      date: '2023-05-16',
      customerName: 'Widget Inc',
      amount: 750.00,
      status: 'pending'
    },
    {
      id: '3',
      number: 'INV-003',
      date: '2023-05-17',
      customerName: 'Gadget Ltd',
      amount: 2200.00,
      status: 'draft'
    },
    {
      id: '4',
      number: 'INV-004',
      date: '2023-05-18',
      customerName: 'Tech Solutions',
      amount: 3400.00,
      status: 'sent'
    },
    {
      id: '5',
      number: 'INV-005',
      date: '2023-05-19',
      customerName: 'Global Enterprises',
      amount: 875.50,
      status: 'overdue'
    }
  ]);

  const handleSelectInvoice = (id: string) => {
    // In a real app, this would navigate to the invoice detail page
    alert(`Viewing invoice ${id}`);
  };

  const handleMarkAsPaid = (id: string) => {
    setInvoices(prev => prev.map(invoice =>
      invoice.id === id ? { ...invoice, status: 'paid' } : invoice
    ));
  };

  const stats = [
    {
      title: 'Total Invoices',
      value: invoices.length,
      trend: {
        value: '+5%',
        isPositive: true
      }
    },
    {
      title: 'Paid This Month',
      value: invoices.filter(i => i.status === 'paid').length,
      trend: {
        value: '+12%',
        isPositive: true
      }
    },
    {
      title: 'Outstanding',
      value: `$${invoices.filter(i => i.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}`,
      trend: {
        value: '-3%',
        isPositive: false
      }
    },
    {
      title: 'Overdue',
      value: invoices.filter(i => i.status === 'overdue').length,
      trend: {
        value: '+2%',
        isPositive: false
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage and track all your invoices"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' }
        ]}
      >
        <Button variant="primary" onClick={() => {
          // In a real app, this would navigate to the invoice creation wizard
          alert('Invoice creation wizard would open here');
        }}>
          New Invoice
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Invoices Table */}
      <div className="space-y-4">
        <InvoicesTable
          invoices={invoices}
          onSelectInvoice={handleSelectInvoice}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </div>
  );
}