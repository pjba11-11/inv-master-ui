import { useForm, FormErrors } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Status matches backend InvoiceStatus enum.
export type InvoiceStatus = 'GENERATED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

// Line items reference products (productId FK), not free-text descriptions.
export interface LineItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceFormValues {
  customerId: string;
  invoiceDate: string;
  gst: number;
  discount: number;
  remarks: string;
  status: InvoiceStatus;
}

export interface InvoiceFormPayload extends InvoiceFormValues {
  subtotal: number;
  grandTotal: number;
  lineItems: LineItem[];
}

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormPayload) => Promise<void> | void;
  initialData?: Partial<InvoiceFormValues>;
  lineItems: LineItem[];
  onAddLineItem: (item: Omit<LineItem, 'id' | 'total'>) => void;
  onUpdateLineItem: (id: string, changes: Partial<Omit<LineItem, 'id' | 'total'>>) => void;
  onRemoveLineItem: (id: string) => void;
}

export const InvoiceForm = ({
  onSubmit,
  initialData = {},
  lineItems = [],
  onAddLineItem,
  onUpdateLineItem,
  onRemoveLineItem,
}: InvoiceFormProps) => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = parseFloat((initialData.gst ?? 0).toFixed(2));
  const discountAmount = parseFloat((initialData.discount ?? 0).toFixed(2));
  const grandTotal = parseFloat((subtotal + gstAmount - discountAmount).toFixed(2));

  const defaultValues: InvoiceFormValues = {
    customerId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    gst: 0,
    discount: 0,
    remarks: '',
    status: 'GENERATED',
    ...initialData,
  };

  const validate = (values: InvoiceFormValues) => {
    const errors: Partial<Record<keyof InvoiceFormValues, string>> = {};
    if (!values.customerId) errors.customerId = 'Customer is required';
    if (!values.invoiceDate) errors.invoiceDate = 'Invoice date is required';
    return errors as FormErrors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useForm<InvoiceFormValues>({
      initialValues: defaultValues,
      validate,
      onSubmit: (data) => onSubmit({ ...data, subtotal, grandTotal, lineItems }),
    });

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Customer *</label>
          <Select
            value={values.customerId}
            onChange={(e) => handleChange('customerId', e.target.value)}
            onBlur={() => handleBlur('customerId')}
            placeholder="Select a customer"
            options={[]}
          />
          {errors.customerId && <p className="mt-1 text-sm text-error">{errors.customerId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Invoice Date *</label>
          <Input
            type="date"
            value={values.invoiceDate}
            onChange={(e) => handleChange('invoiceDate', e.target.value)}
            onBlur={() => handleBlur('invoiceDate')}
          />
          {errors.invoiceDate && <p className="mt-1 text-sm text-error">{errors.invoiceDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
          <Select
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value as InvoiceStatus)}
            options={[
              { value: 'GENERATED',      label: 'Generated' },
              { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
              { value: 'PAID',           label: 'Paid' },
              { value: 'CANCELLED',      label: 'Cancelled' },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">GST Amount</label>
          <Input
            type="number"
            value={values.gst.toString()}
            onChange={(e) => handleChange('gst', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Discount</label>
          <Input
            type="number"
            value={values.discount.toString()}
            onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-text-muted mb-1">Remarks</label>
        <Textarea
          value={values.remarks}
          onChange={(e) => handleChange('remarks', e.target.value)}
          placeholder="Enter any remarks"
          rows={2}
        />
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-surface-2 space-y-2">
        <div className="flex justify-between">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">GST</span>
          <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Discount</span>
          <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-surface-2">
          <span className="font-semibold text-lg">Grand Total</span>
          <span className="font-semibold text-2xl text-primary-500">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" type="button">Back</Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || lineItems.length === 0}
        >
          {isSubmitting ? 'Saving Invoice...' : 'Create Invoice'}
        </Button>
      </div>
    </>
  );
};
