'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { FormSkeleton, DetailSkeleton } from '@/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

interface Invoice {
  id: number;
  invoiceNumber: string;
  grandTotal: number;
  status: string;
}

interface Payment {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  remarks: string;
}

export default function InvoicePaymentsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMethod: '',
    transactionReference: '',
    remarks: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/invoices/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/invoices/${id}/payments`).then(r => r.json()).catch(() => []),
    ]).then(([inv, pmts]) => {
      setInvoice(inv);
      setPayments(Array.isArray(pmts) ? pmts : []);
    });
  }, [id]);

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const balanceDue = invoice ? Number(invoice.grandTotal) - totalPaid : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.paymentMethod) return;
    setSubmitting(true);
    const res = await fetch(`/api/invoices/${id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    });
    if (res.ok) {
      const newPayment = await res.json();
      setPayments(prev => [...prev, newPayment]);
      setForm(prev => ({ ...prev, amount: '', transactionReference: '', remarks: '' }));
    }
    setSubmitting(false);
  };

  if (!invoice) return (
    <div className="space-y-6">
      <PageHeader title="Payments" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormSkeleton fields={4} />
        <DetailSkeleton fields={3} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Payments — ${invoice.invoiceNumber}`}
        description={`Balance due: ₹${balanceDue.toFixed(2)}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: invoice.invoiceNumber, href: `/dashboard/invoices/${id}` },
          { label: 'Payments', href: `/dashboard/invoices/${id}/payments` },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Invoice</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Record Payment Form */}
        <Card>
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Record Payment</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Amount *</label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    min="0.01"
                    step="0.01"
                    max={balanceDue}
                    required
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-text-muted">Max: ₹{balanceDue.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Date *</label>
                  <Input
                    type="date"
                    value={form.paymentDate}
                    onChange={e => setForm(f => ({ ...f, paymentDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Payment Method *</label>
                  <Select
                    value={form.paymentMethod}
                    onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                    options={[
                      { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                      { value: 'UPI', label: 'UPI' },
                      { value: 'CASH', label: 'Cash' },
                      { value: 'CHEQUE', label: 'Cheque' },
                      { value: 'OTHER', label: 'Other' },
                    ]}
                    placeholder="Select method"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Transaction Reference</label>
                  <Input
                    value={form.transactionReference}
                    onChange={e => setForm(f => ({ ...f, transactionReference: e.target.value }))}
                    placeholder="UTR / cheque no."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Remarks</label>
                <Input
                  value={form.remarks}
                  onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={submitting || balanceDue <= 0}>
                  {submitting ? 'Recording...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Payment History */}
        <Card>
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4 flex justify-between">
              <h2 className="text-lg font-medium text-text-primary">Payment History</h2>
              <span className="text-sm text-text-muted">Total paid: ₹{totalPaid.toFixed(2)}</span>
            </div>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map(p => (
                  <div key={p.id} className="p-4 rounded-lg border border-surface-2 bg-surface-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-text-primary">₹{Number(p.amount).toFixed(2)}</span>
                      <span className="text-sm text-text-muted">{p.paymentDate}</span>
                    </div>
                    <div className="text-sm text-text-muted mt-1">
                      {p.paymentMethod}{p.transactionReference ? ` · ${p.transactionReference}` : ''}
                    </div>
                    {p.remarks && <p className="text-sm text-text-muted mt-1 italic">{p.remarks}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-center py-4">No payments recorded yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
