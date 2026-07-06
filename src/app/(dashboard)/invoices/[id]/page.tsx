'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/widgets/stat-card';
import { RevenueChart } from '@/components/widgets/revenue-chart';
import { InvoicesTable } from '@/components/widgets/invoices-table';

interface Invoice {
  id: string;
  number: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    tax: number;
  }>;
  discount: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  payments: Array<{
    id: string;
    amount: number;
    date: string;
    method: string;
    reference?: string;
  }>;
}

export default function InvoiceDetailPage() {
  // Mock invoice data - in a real app, this would come from API
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState(false);

  // Initialize mock data
  useEffect(() => {
    setInvoice({
      id: '1',
      number: 'INV-001',
      date: '2023-05-15',
      customerName: 'Acme Corp',
      customerEmail: 'info@acme.com',
      customerAddress: '123 Business Ave, Suite 100\nNew York, NY 10001\nUSA',
      items: [
        { id: '1', description: 'Web Development Services', quantity: 10, rate: 100, tax: 15 },
        { id: '2', description: 'UI/UX Design', quantity: 5, rate: 150, tax: 15 },
        { id: '3', description: 'Project Management', quantity: 8, rate: 75, tax: 15 }
      ],
      discount: 10,
      taxRate: 15,
      subtotal: 2475,
      taxAmount: 371.25,
      total: 2558.25,
      status: 'sent',
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly fee.',
      createdAt: '2023-05-10T10:30:00Z',
      updatedAt: '2023-05-15T14:22:00Z',
      payments: [
        { id: 'pay1', amount: 500, date: '2023-05-20', method: 'Bank Transfer', reference: 'TXN123456' }
      ]
    });
  }, []);

  const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'success';
      case 'overdue': return 'error';
      case 'draft': return 'secondary';
      case 'sent':
      case 'viewed': return 'warning';
      default: return 'default';
    }
  };

  const handleMarkAsPaid = () => {
    // In a real app, this would update the invoice status via API
    alert('Invoice marked as paid!');
  };

  const handleRecordPayment = () => {
    // Navigate to payments page
    // In a real app with routing: router.push(`/dashboard/invoices/${invoice?.id}/payments`);
    alert('Navigate to payment recording');
  };

  const handleEditInvoice = () => {
    setEditing(true);
  };

  if (!invoice) {
    return <div className="text-center py-8">Loading invoice...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice #${invoice.number}`}
        description={`Issued on ${new Date(invoice.date).toLocaleDateString()}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Invoice #${invoice.number}', href: `/dashboard/invoices/${invoice.id}` }
        ]}
      >
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleEditInvoice}>
            Edit Invoice
          </Button>
          <Button
            variant="outline"
            onClick={handleRecordPayment}
            disabled={invoice.status === 'paid'}
          >
            Record Payment
          </Button>
          <Button
            variant={invoice.status === 'paid' ? 'secondary' : 'primary'}
            onClick={handleMarkAsPaid}
            disabled={invoice.status === 'paid'}
          >
            {invoice.status === 'paid' ? 'Paid' : 'Mark as Paid'}
          </Button>
        </div>
      </PageHeader>

      {/* Invoice Header */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <p className="text-text-muted">Bill To</p>
            <address className="text-text-primary">
              {invoice.customerName}<br/>
              {invoice.customerEmail}<br/>
              {invoice.customerAddress}
            </address>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-text-muted">Invoice Details</p>
            <div className="space-y-1">
              <span className="font-medium text-text-muted">Invoice #:</span>
              <span className="text-text-primary">{invoice.number}</span>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-text-muted">Date:</span>
              <span className="text-text-primary">{new Date(invoice.date).toLocaleDateString()}</span>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-text-muted">Due Date:</span>
              <span className="text-text-primary">{new Date(invoice.date).toLocaleDateString()}</span>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-text-muted">Status:</span>
              <Badge variant={getStatusVariant(invoice.status)} className="text-xs px-2.5 py-0.5">
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Invoice Summary</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard title="Subtotal" value={`$${invoice.subtotal.toFixed(2)}`} />
          <StatCard title="Tax" value={`$${invoice.taxAmount.toFixed(2)}`} />
          <StatCard title="Discount" value={`-$${(invoice.subtotal * invoice.discount / 100).toFixed(2)}`} />
          <StatCard title="Total Due" value={`$${invoice.total.toFixed(2)}`} />
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Line Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-spacing-0">
            <thead>
              <tr className="bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Description</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase">Quantity</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase">Rate</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase">Tax (%)</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {invoice.items.map((item) => {
                const amount = item.quantity * item.rate;
                return (
                  <tr key={item.id} className="hover:bg-surface-3 transition-colors">
                    <td className="px-4 py-4 text-sm text-text-primary">{item.description}</td>
                    <td className="px-4 py-4 text-sm text-center text-text-primary">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-center text-text-primary">${item.rate.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm text-center text-text-primary">{item.tax}%</td>
                    <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">${amount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-surface-2">
                <td colSpan="4" className="px-4 py-4 text-right font-medium text-text-muted">Subtotal:</td>
                <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">${invoice.subtotal.toFixed(2)}</td>
              </tr>
              <tr className="bg-surface-2">
                <td colSpan="4" className="px-4 py-4 text-right font-medium text-text-muted">Tax ({invoice.taxRate}%):</td>
                <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">${invoice.taxAmount.toFixed(2)}</td>
              </tr>
              <tr className="bg-surface-2">
                <td colSpan="4" className="px-4 py-4 text-right font-medium text-text-muted">Discount ({invoice.discount}%):</td>
                <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">-${(invoice.subtotal * invoice.discount / 100).toFixed(2)}</td>
              </tr>
              <tr className="bg-surface-2">
                <td colSpan="4" className="px-4 py-4 text-right font-medium text-text-primary">Total:</td>
                <td className="px-4 py-4 text-sm text-right text-text-primary font-medium text-xl">${invoice.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold mb-2 text-text-primary">Payment History</h3>
          {invoice.status !== 'paid' && (
            <Button variant="outline" size="sm" onClick={handleRecordPayment}>
              Record Payment
            </Button>
          )}
        </div>
        {invoice.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-spacing-0">
              <thead>
                <tr className="bg-surface-2">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {invoice.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-surface-3 transition-colors">
                    <td className="px-4 py-4 text-sm text-text-primary">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm text-text-primary">${payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm text-text-primary">{payment.method}</td>
                    <td className="px-4 py-4 text-sm text-text-primary">{payment.reference || '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface-2">
                  <td colSpan="3" className="px-4 py-4 text-right font-medium text-text-muted">Total Paid:</td>
                  <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">
                    ${invoice.payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-surface-2">
                  <td colSpan="3" className="px-4 py-4 text-right font-medium text-text-muted">Balance Due:</td>
                  <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">
                    ${(invoice.total - invoice.payments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="text-text-muted text-center py-4">No payments recorded yet.</p>
        )}
      </div>

      {/* Notes and Terms */}
      {invoice.notes || invoice.terms ? (
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Notes & Terms</h3>
          {invoice.notes && (
            <div className="mb-4">
              <p className="font-medium text-text-muted mb-1">Notes:</p>
              <p className="text-text-muted whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <p className="font-medium text-text-muted mb-1">Terms:</p>
              <p className="text-text-muted whitespace-pre-line">{invoice.terms}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}