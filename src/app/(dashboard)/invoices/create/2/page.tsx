'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/widgets/stat-card';
import { useForm } from '@/components/forms/use-form';

interface ItemFormValues {
  description: string;
  quantity: number;
  rate: number;
  tax: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

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

export default function CreateInvoiceStep2({
  customerId,
  onPrevious,
  onNext
}: {
  customerId: string;
  onPrevious: () => void;
  onNext: (formData: InvoiceFormValues) => void;
}) {
  const [items, setItems] = useState<ItemFormValues[]>([]);
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days from now
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(15);
  const [notes, setNotes] = useState<string>('');
  const [terms, setTerms] = useState<string>('Payment due within 30 days. Late payments subject to 1.5% monthly fee.');

  // Mock customer data - in a real app this would come from API/context
  const customers: Record<string, Customer> = {
    '1': { id: '1', name: 'Acme Corp', email: 'info@acme.com', phone: '+1 (555) 123-4567' },
    '2': { id: '2', name: 'Widget Inc', email: 'sales@widgetinc.com', phone: '+1 (555) 234-5678' },
    '3': { id: '3', name: 'Gadget Ltd', email: 'contact@gadgetltd.com', phone: '+1 (555) 345-6789' },
    '4': { id: '4', name: 'Tech Solutions', email: 'hello@techsolutions.com', phone: '+1 (555) 456-7890' },
    '5': { id: '5', name: 'Global Enterprises', email: 'info@globalent.com', phone: '+1 (555) 567-8901' }
  };

  const customer = customers[customerId] || { name: 'Unknown Customer', email: '', phone: '' };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, discountAmount, total };
  };

  const { subtotal, taxAmount, discountAmount, total } = calculateTotals();

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      tax: 0
    }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (index: number, field: keyof ItemFormValues, value: any) => {
    setItems(items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSaveAndContinue = () => {
    // Validate
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    // Prepare form data for next step
    const formData: InvoiceFormValues = {
      customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: `${customer.name}\n123 Business St\nCity, State 12345`, // In real app, this would come from customer data
      invoiceDate,
      dueDate,
      items: items.map((item, index) => ({
        id: item.id || `${Date.now()}-${index}`,
        description: item.description,
        quantity: item.number,
        rate: item.rate,
        tax: item.tax
      })),
      discount,
      taxRate,
      notes,
      terms
    };

    onNext(formData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Step 2: Add Items"
        description={`Adding items for invoice for ${customer.name}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create' },
          { label: 'Step 1: Customer', href: '/dashboard/invoices/create' },
          { label: 'Step 2: Items', href: '/dashboard/invoices/create/2' }
        ]}
      >
        <Button variant="outline" onClick={onPrevious}>
          Back to Customer
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveAndContinue}
          disabled={items.length === 0}
        >
          Continue to Review
        </Button>
      </PageHeader>

      {/* Customer Info */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-text-primary">{customer.name}</p>
            <p className="text-text-muted text-sm">{customer.email}</p>
            <p className="text-text-muted text-sm">{customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-6">
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Line Items</h3>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              Add Item
            </Button>
          </div>

          {items.length === 0 ? (
            <p className="text-text-muted text-center py-6">No items added yet. Click "Add Item" to begin.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg bg-surface-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-text-primary">Item {index + 1}</h4>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Enter item description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Quantity</label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Rate ($)</label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Tax (%)</label>
                      <Input
                        type="number"
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Summary</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard title="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <StatCard title="Tax" value={`$${taxAmount.toFixed(2)}`} />
            <StatCard title="Discount" value={`-$${discountAmount.toFixed(2)}`} />
            <StatCard title="Estimated Total" value={`$${total.toFixed(2)}`} />
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Invoice Details</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Invoice Date</label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Discount (%)</label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Tax Rate (%)</label>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Notes & Terms</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full rounded-md border border-surface-2 px-3 py-2 text-text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-scrollbar-thumb]:bg-primary-500 [&::-webkit-scrollbar]:h-[0.5rem]"
                rows="3"
                placeholder="Optional notes for the customer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Terms and Conditions</label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="block w-full rounded-md border border-surface-2 px-3 py-2 text-text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-scrollbar-thumb]:bg-primary-500 [&::-webkit-scrollbar]:h-[0.5rem]"
                rows="3"
                placeholder="Enter payment terms and conditions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}