'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';

interface PaymentFormValues {
  amount: number;
  date: string;
  method: string;
  reference: string;
  remarks: string;
}

interface Invoice {
  id: string;
  number: string;
  total: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  payments: Array<{
    id: string;
    amount: number;
    date: string;
    method: string;
    reference: string;
  }>;
}

export default function InvoicePaymentsPage() {
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormValues>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: '',
    reference: '',
    remarks: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // In a real app, we'd get the invoice ID from URL params and fetch the invoice
  // For demo, we'll simulate with mock data when component mounts
  React.useEffect(() => {
    // Simulate getting invoice ID from route params
    // In real app: const { id } = params; setInvoiceId(id);
    setInvoiceId('1'); // Hardcoded for demo

    // Fetch invoice data (mock)
    setInvoice({
      id: '1',
      number: 'INV-001',
      total: 2558.25,
      status: 'sent',
      payments: [
        { id: 'pay1', amount: 500, date: '2023-05-20', method: 'Bank Transfer', reference: 'TXN123456' }
      ]
    });
  }, []);

  const calculateBalance = () => {
    if (!invoice) return 0;
    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    return invoice.total - totalPaid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setPaymentForm({ ...paymentForm, [name]: checked });
    } else {
      setPaymentForm({ ...paymentForm, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // In a real app, this would make an API call to record the payment
      // For demo, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Payment recorded successfully!');
      // Reset form
      setPaymentForm({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        method: '',
        reference: '',
        remarks: ''
      });

      // In a real app, we'd refetch the invoice to update payment list
    } catch (error) {
      alert('Failed to record payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Go back to invoice detail
    // In a real app: router.push(`/dashboard/invoices/${invoiceId}`);
    window.history.back();
  };

  if (!invoice) {
    return <div className="text-center py-8">Loading invoice...</div>;
  }

  const balanceDue = calculateBalance();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Record Payment for Invoice #${invoice.number}`}
        description={`Balance due: $${balanceDue.toFixed(2)}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: `Invoice #${invoice.number}`, href: `/dashboard/invoices/${invoice.id}` },
          { label: 'Record Payment', href: `/dashboard/invoices/${invoice.id}/payments` }
        ]}
      >
        <Button variant="outline" onClick={handleCancel}>
          Back to Invoice
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-lg-4">
        {/* Invoice Info */}
        <Card className="border-surface-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Invoice Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-muted">Invoice Number</p>
                  <p className="font-medium text-text-primary">{invoice.number}</p>
                </div>
                <div>
                  <p className="text-text-muted">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-success/10 text-success' :
                    invoice.status === 'overdue' ? 'bg-error/10 text-error' :
                    invoice.status === 'draft' ? 'bg-secondary/10 text-secondary' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-text-muted">Total Amount</p>
                  <p className="font-medium text-text-primary text-lg">${invoice.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Already Paid</p>
                  <p className="font-medium text-text-primary text-lg">
                    ${invoice.payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Balance Due</p>
                  <p className="font-medium text-text-primary text-lg ${balanceDue === 0 ? 'text-success' : ''}">
                    ${balanceDue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Form */}
        <Card className="border-surface-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Record Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Amount
                  </label>
                  <Input
                    type="number"
                    name="amount"
                    value={paymentForm.amount}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    max={balanceDue}
                    required
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    Maximum: ${balanceDue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Date
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={paymentForm.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Method
                  </label>
                  <Select
                    name="method"
                    value={paymentForm.method}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select payment method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Reference/Transaction ID
                  </label>
                  <Input
                    type="text"
                    name="reference"
                    value={paymentForm.reference}
                    onChange={handleInputChange}
                    placeholder="Transaction ID, check number, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={paymentForm.remarks}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-surface-2 px-3 py-2 text-text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-very:ring-primary-400 focus-very:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-scrollbar-thumb]:bg-primary-500 [&::-webkit-scrollbar]:h-[0.5rem]"
                  rows="3"
                  placeholder="Any additional notes about this payment"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting || !paymentForm.amount || paymentForm.amount <= 0 || paymentForm.amount > balanceDue || !paymentForm.method}
                  className="w-auto"
                >
                  {submitting ? 'Processing...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Payment History */}
        <Card className="border-surface-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Payment History</h2>
            {invoice.payments.length > 0 ? (
              <div className="space-y-4">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="p-4 border rounded-lg bg-surface-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">${payment.amount.toFixed(2)}</p>
                        <p className="text-text-muted text-sm">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right text-sm space-x-3">
                        <span className="text-text-muted">{payment.method}</span>
                        {payment.reference && (
                          <span className="ml-2 text-text-muted">#{payment.reference}</span>
                        )}
                      </div>
                    </div>
                    {payment.remarks && (
                      <p className="mt-2 text-text-muted text-sm italic">{payment.remarks}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-center py-4">
                No payments recorded for this invoice yet.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}