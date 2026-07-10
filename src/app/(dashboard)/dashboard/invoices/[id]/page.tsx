'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/widgets/stat-card';
import { StatCardSkeleton, DetailSkeleton, TableSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type InvoiceStatus = 'GENERATED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  discount: number;
  grandTotal: number;
  poNumber: string;
  status: InvoiceStatus;
  remarks: string;
  createdAt: string;
}

interface LineItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Payment {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  remarks: string;
}

const statusBadge: Record<InvoiceStatus, string> = {
  GENERATED: 'bg-warning/20 text-warning',
  PARTIALLY_PAID: 'bg-primary-500/20 text-primary-500',
  PAID: 'bg-success/20 text-success',
  CANCELLED: 'bg-error/20 text-error',
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const load = () => {
    setError(''); setLoading(true);
    Promise.all([
      fetch(`/api/invoices/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/invoices/${id}/line-items`).then(r => r.json()).catch(() => []),
      fetch(`/api/invoices/${id}/payments`).then(r => r.json()).catch(() => []),
    ]).then(([inv, items, pmts]) => {
      setInvoice(inv);
      setLineItems(Array.isArray(items) ? items : []);
      setPayments(Array.isArray(pmts) ? pmts : []);
      setLoading(false);
    }).catch(() => { setError('Failed to load invoice.'); setLoading(false); });
  };

  useEffect(() => { load(); }, [id]);

  const markAsPaid = async () => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAID' }),
    });
    if (res.ok) setInvoice(prev => prev ? { ...prev, status: 'PAID' } : prev);
  };

  const cancelInvoice = async () => {
    setCancelling(true);
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
    if (res.ok) setInvoice(prev => prev ? { ...prev, status: 'CANCELLED' } : prev);
    setCancelConfirm(false);
    setCancelling(false);
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/invoices/${id}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice?.invoiceNumber ?? id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <PageHeader title="Invoice" />
      <StatCardSkeleton />
      <DetailSkeleton fields={6} />
      <TableSkeleton rows={3} cols={4} />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!invoice) { router.push('/dashboard/invoices'); return null; }

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const balanceDue = Number(invoice.grandTotal) - totalPaid;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        description={`Issued on ${invoice.invoiceDate}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: invoice.invoiceNumber, href: `/dashboard/invoices/${id}` },
        ]}
      >
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button variant="outline" onClick={downloadPdf} loading={downloading}>
            Download PDF
          </Button>
          {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
            <Link href={`/dashboard/invoices/${id}/payments`}>
              <Button variant="outline">Record Payment</Button>
            </Link>
          )}
          {invoice.status === 'PAID' && (
            <Button variant="outline" disabled>Record Payment</Button>
          )}
          {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
            <Button variant="primary" onClick={markAsPaid}>Mark as Paid</Button>
          )}
          {invoice.status === 'GENERATED' && (
            cancelConfirm ? (
              <div className="flex gap-2">
                <Button variant="destructive" loading={cancelling} onClick={cancelInvoice}>Confirm Cancel?</Button>
                <Button variant="ghost" onClick={() => setCancelConfirm(false)}>No</Button>
              </div>
            ) : (
              <Button variant="ghost" onClick={() => setCancelConfirm(true)}>Cancel Invoice</Button>
            )
          )}
        </div>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title="Subtotal" value={`₹${Number(invoice.subtotal).toFixed(2)}`} />
        <StatCard title="CGST" value={`₹${Number(invoice.cgst).toFixed(2)}`} />
        <StatCard title="SGST" value={`₹${Number(invoice.sgst).toFixed(2)}`} />
        <StatCard title="Grand Total" value={`₹${Number(invoice.grandTotal).toFixed(2)}`} />
      </div>

      {/* Invoice Details */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div>
            <p className="text-sm text-text-muted">Invoice Number</p>
            <p className="font-medium text-text-primary">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Invoice Date</p>
            <p className="font-medium text-text-primary">{invoice.invoiceDate}</p>
          </div>
          {invoice.poNumber && (
            <div>
              <p className="text-sm text-text-muted">PO Number</p>
              <p className="font-medium text-text-primary">{invoice.poNumber}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-text-muted">Status</p>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge[invoice.status]}`}>
              {invoice.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <p className="text-sm text-text-muted">Discount</p>
            <p className="font-medium text-text-primary">₹{Number(invoice.discount).toFixed(2)}</p>
          </div>
          {invoice.remarks && (
            <div className="md:col-span-2">
              <p className="text-sm text-text-muted">Remarks</p>
              <p className="text-text-primary">{invoice.remarks}</p>
            </div>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Line Items</h3>
        {lineItems.length > 0 ? (
          <table className="w-full border-spacing-0">
            <thead>
              <tr className="bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Product</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-muted uppercase">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Unit Price</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {lineItems.map(item => (
                <tr key={item.id} className="hover:bg-surface-3">
                  <td className="px-4 py-3 text-text-primary">{item.productName}</td>
                  <td className="px-4 py-3 text-center text-text-primary">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-text-primary">₹{Number(item.unitPrice).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-text-primary font-medium">₹{(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-text-muted text-center py-4">No line items recorded.</p>
        )}
      </div>

      {/* Payments */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Payments</h3>
          <div className="text-sm text-text-muted">Balance due: <span className="font-semibold text-text-primary">₹{balanceDue.toFixed(2)}</span></div>
        </div>
        {payments.length > 0 ? (
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
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-surface-3">
                  <td className="px-4 py-3 text-text-primary">{p.paymentDate}</td>
                  <td className="px-4 py-3 text-text-primary">₹{Number(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-text-primary">{p.paymentMethod || '—'}</td>
                  <td className="px-4 py-3 text-text-primary">{p.transactionReference || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-text-muted text-center py-4">No payments recorded yet.</p>
        )}
      </div>
    </div>
  );
}
