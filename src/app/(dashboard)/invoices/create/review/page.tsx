'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/widgets/stat-card';
import { RevenueChart } from '@/components/widgets/revenue-chart';
import { useForm } from '@/components/forms/use-form';
import { Link } from 'next/link';

interface InvoiceFormValues {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  invoiceDate: string;
  dueDate: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    tax: number;
  }>;
  discount: number;
  taxRate: number;
  notes: string;
  terms: string;
}

export default function InvoiceReviewPage() {
  const [formData, setFormData] = useState<InvoiceFormValues | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate receiving data from previous steps
  // In a real app, this would come from URL params or state management
  const initializeFormData = () => {
    if (!formData) {
      setFormData({
        customerId: '1',
        customerName: 'Acme Corp',
        customerEmail: 'info@acme.com',
        customerPhone: '+1 (555) 123-4567',
        customerAddress: '123 Business Ave, Suite 100\nNew York, NY 10001\nUSA',
        invoiceDate: '2023-05-15',
        dueDate: '2023-06-15',
        items: [
          { id: '1', description: 'Web Development Services', quantity: 10, rate: 100, tax: 15 },
          { id: '2', description: 'UI/UX Design', quantity: 5, rate: 150, tax: 15 },
          { id: '3', description: 'Project Management', quantity: 8, rate: 75, tax: 15 }
        ],
        discount: 10,
        taxRate: 15,
        notes: 'Thank you for your business!',
        terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly fee.'
      });
    }
  };

  // Calculate totals
  const calculateTotals = (data: InvoiceFormValues) => {
    const subtotal = data.items.reduce(
      (sum, item) => sum + (item.quantity * item.rate),
      0
    );

    const taxAmount = (subtotal * data.taxRate) / 100;
    const discountAmount = (subtotal * data.discount) / 100;
    const total = subtotal + taxAmount - discountAmount;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  const handleGenerateInvoice = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      alert('Invoice generated successfully!');
      // In a real app, this would redirect to the invoice detail page
    }, 1500);
  };

  // Initialize form data on mount
  React.useEffect(() => {
    initializeFormData();
  }, []);

  if (!formData) {
    return <div className="text-center py-8">Loading invoice data...</div>;
  }

  const { subtotal, taxAmount, discountAmount, total } = calculateTotals(formData);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review & Generate Invoice"
        description="Review invoice details before generating"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create' },
          { label: 'Review', href: '/dashboard/invoices/create/review' }
        ]}
      >
        <Button variant="outline" onClick={() => {
          // Navigate back to step 2
          window.history.back();
        }}>
          Back to Items
        </Button>
        <Button
          variant="primary"
          onClick={handleGenerateInvoice}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Invoice'}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-lg-4">
        {/* Customer Info */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Customer Information</h3>
          <div className="space-y-3">
            <p><span className="font-medium text-text-muted">Name:</span> <span className="text-text-primary">{formData.customerName}</span></p>
            <p><span className="font-medium text-text-muted">Email:</span> <span className="text-text-primary">{formData.customerEmail}</span></p>
            <p><span className="font-medium text-text-muted">Phone:</span> <span className="text-text-primary">{formData.customerPhone}</span></p>
            <p><span className="font-medium text-text-muted">Address:</span> <span className="text-text-primary whitespace-pre-line">{formData.customerAddress}</span></p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Invoice Details</h3>
          <div className="space-y-3">
            <p><span className="font-medium text-text-muted">Invoice Date:</span> <span className="text-text-primary">{new Date(formData.invoiceDate).toLocaleDateString()}</span></p>
            <p><span className="font-medium text-text-muted">Due Date:</span> <span className="text-text-primary">{new Date(formData.dueDate).toLocaleDateString()}</span></p>
            <p><span className="font-medium text-text-muted">Discount:</span> <span className="text-text-primary">{formData.discount}%</span></p>
            <p><span className="font-medium text-text-muted">Tax Rate:</span> <span className="text-text-primary">{formData.taxRate}%</span></p>
          </div>
        </div>

        {/* Items */}
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
                {formData.items.map((item) => {
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
                  <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">${subtotal.toFixed(2)}</td>
                </tr>
                <tr className="bg-surface-2">
                  <td colSpan="4" className="px-4 py-4 text-right font-medium text-text-muted">Tax ({formData.taxRate}%):</td>
                  <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">${taxAmount.toFixed(2)}</td>
                </tr>
                <tr className="bg-surface-2">
                  <td colSpan="4" className="px-4 py-4 text-right font-medium text-text-muted">Discount ({formData.discount}%):</td>
                  <td className="px-4 py-4 text-sm text-right text-text-primary font-medium">-${discountAmount.toFixed(2)}</td>
                </tr>
                <tr className="bg-surface-2">
                  <td colSpan="4" className="px-4 py-4 text-right font-medium text-text-primary">Total:</td>
                  <td className="px-4 py-4 text-sm text-right text-text-primary font-medium text-xl">${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Notes & Terms</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="font-medium text-text-muted mb-1">Notes:</p>
              <p className="text-text-muted whitespace-pre-line">{formData.notes}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-text-muted mb-1">Terms:</p>
              <p className="text-text-muted whitespace-pre-line">{formData.terms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Subtotal" value={`$${subtotal.toFixed(2)}`} />
        <StatCard title="Tax" value={`$${taxAmount.toFixed(2)}`} trend={{ value: `+${formData.taxRate}%`, isPositive: true }} />
        <StatCard title="Discount" value={`-$${discountAmount.toFixed(2)}`} trend={{ value: `-${formData.discount}%`, isPositive: false }} />
        <StatCard title="Total Due" value={`$${total.toFixed(2)}`} trend={{ value: '+100%', isPositive: true }} />
      </div>
    </div>
  );
}