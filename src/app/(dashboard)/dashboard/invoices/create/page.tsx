'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { WriteGuard } from '@/components/guards/write-guard';
import { calculateInvoiceTotals } from '@/lib/invoice-calc';

interface Customer { id: number; customerName: string; phone?: string; gstNumber?: string; }
interface Product { productId: number; productName: string; sellingPrice: number; hsnCode?: string; active?: boolean; }
interface LineItem { productId: number; quantity: number; unitPrice: number; }

export default function CreateInvoicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ productId: 0, quantity: 1, unitPrice: 0 }]);
  const [poNumber, setPoNumber] = useState('');
  const [discount, setDiscount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(data => setCustomers(Array.isArray(data) ? data : [])).catch(() => {});
    fetch('/api/products').then(r => r.json()).then(data => setProducts(Array.isArray(data) ? data.filter((p: Product) => p.active !== false) : [])).catch(() => {});
  }, []);

  const addItem = () => setItems(prev => [...prev, { productId: 0, quantity: 1, unitPrice: 0 }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: keyof LineItem, value: number) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx !== i) return item;
      if (field === 'productId') {
        const product = products.find(p => p.productId === value);
        return { ...item, productId: value, unitPrice: product?.sellingPrice ?? 0 };
      }
      return { ...item, [field]: value };
    }));
  };

  const { subtotal, cgst, sgst, grandTotal } = calculateInvoiceTotals(items, discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!customerId) { setError('Please select a customer.'); return; }
    const validItems = items.filter(i => i.productId > 0 && i.quantity > 0);
    if (validItems.length === 0) { setError('Add at least one product.'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          poNumber: poNumber || undefined,
          discount: discount > 0 ? discount : undefined,
          remarks: remarks || undefined,
          items: validItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? data.message ?? 'Failed to create invoice.'); setSubmitting(false); return; }
      router.push(`/dashboard/invoices/${data.id ?? data.invoiceId}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.customerName.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.gstNumber ?? '').toLowerCase().includes(customerSearch.toLowerCase())
  );

  const productOptions = (i: number) => [
    { value: '0', label: 'Select product…' },
    ...products
      .filter(p => !items.some((item, idx) => idx !== i && item.productId === p.productId))
      .map(p => ({ value: String(p.productId), label: p.productName })),
  ];

  const selectedCustomer = customers.find(c => c.id === customerId);

  return (
    <WriteGuard redirectTo="/dashboard/invoices">
    <div className="space-y-6">
      <PageHeader
        title="Create Invoice"
        description="Select a customer, add products, and submit."
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create', href: '/dashboard/invoices/create' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 — Customer picker */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-xs font-semibold text-primary-500">1</span>
            <h3 className="text-base font-semibold text-text-primary">Select Customer</h3>
          </div>

          {customers.length === 0 ? (
            <div className="rounded-lg border border-surface-2 p-4 text-center">
              <p className="text-sm text-text-muted">No customers yet.</p>
              <Link href="/dashboard/customers/add" className="mt-2 inline-block text-xs text-primary-500 hover:underline">Add a customer →</Link>
            </div>
          ) : (
            <>
              <Input
                type="search"
                placeholder="Search customers…"
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
                className="max-w-xs"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCustomers.map(c => {
                  const selected = customerId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCustomerId(selected ? null : c.id)}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                        selected
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-surface-3 bg-surface-2 hover:border-surface-4'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">{c.customerName}</p>
                        {c.gstNumber && <p className="text-xs text-text-muted">{c.gstNumber}</p>}
                        {c.phone && <p className="text-xs text-text-muted">{c.phone}</p>}
                      </div>
                      {selected && (
                        <svg className="w-4 h-4 text-primary-500 shrink-0 ml-2" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedCustomer && (
                <p className="text-xs text-primary-500 font-medium">Selected: {selectedCustomer.customerName}</p>
              )}
            </>
          )}
        </div>

        {/* Step 2 — Line Items */}
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-xs font-semibold text-primary-500">2</span>
              <h3 className="text-base font-semibold text-text-primary">Add Products</h3>
            </div>
            <Button variant="secondary" size="sm" type="button" onClick={addItem}>+ Add Row</Button>
          </div>

          {products.length === 0 ? (
            <div className="rounded-lg border border-surface-2 p-4 text-center">
              <p className="text-sm text-text-muted">No products in catalog.</p>
              <Link href="/dashboard/products/add" className="mt-2 inline-block text-xs text-primary-500 hover:underline">Add a product →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-2">
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase w-1/2">Product</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Qty</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Unit Price</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-text-muted uppercase">Total</th>
                    <th className="px-3 py-2 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2">
                  {items.map((item, i) => (
                    <tr key={i} className="align-middle">
                      <td className="px-3 py-2">
                        <Select
                          value={String(item.productId)}
                          onChange={e => updateItem(i, 'productId', Number(e.target.value))}
                          options={productOptions(i)}
                        />
                      </td>
                      <td className="px-3 py-2 w-24">
                        <Input
                          type="number"
                          value={String(item.quantity)}
                          onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 1)}
                          className="text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-right text-text-primary">₹{Number(item.unitPrice).toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-medium text-text-primary">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(i)}
                            className="text-text-muted hover:text-error transition-colors text-lg leading-none" aria-label="Remove">×</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Step 3 — Details & Totals */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-surface-1 rounded-xl border border-surface-2 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-xs font-semibold text-primary-500">3</span>
              <h3 className="text-base font-semibold text-text-primary">Details</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">PO Number (optional)</label>
              <Input value={poNumber} onChange={e => setPoNumber(e.target.value)} placeholder="e.g. PO-2024-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Discount (₹)</label>
              <Input type="number" value={String(discount)} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Remarks (optional)</label>
              <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Any additional notes…" rows={3} />
            </div>
          </div>

          <div className="bg-surface-1 rounded-xl border border-surface-2 p-6 space-y-3">
            <h3 className="text-base font-semibold text-text-primary mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="text-text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>CGST (9%)</span>
                <span className="text-text-primary">₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>SGST (9%)</span>
                <span className="text-text-primary">₹{sgst.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-text-muted">
                  <span>Discount</span>
                  <span className="text-error">−₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-text-primary border-t border-surface-2 pt-2 mt-2">
                <span>Grand Total</span>
                <span className="text-primary-400 text-lg">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-error rounded-lg px-4 py-3" style={{ background: 'var(--error-bg, rgba(239,68,68,0.1))' }}>
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/invoices">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button variant="primary" type="submit" loading={submitting}>
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
    </WriteGuard>
  );
}
