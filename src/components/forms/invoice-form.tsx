import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface InvoiceFormValues {
  customerId: string;
  issueDate: string;
  dueDate: string;
  poNumber: string;
  notes: string;
  terms: string;
  discountAmount: number;
  status: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceFormProps {
  onSubmit: (data: any) => Promise<void> | void;
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
  onRemoveLineItem
}: InvoiceFormProps) => {
  // Calculate subtotal, tax, and total
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  
  // These would typically come from company settings in a real app
  const taxRate = 0.1; // 10% tax rate as example
  const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
  const discountAmount = parseFloat((initialData.discountAmount || 0).toFixed(2));
  const total = parseFloat((subtotal + taxAmount - discountAmount).toFixed(2));

  const defaultValues: InvoiceFormValues = {
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    poNumber: '',
    notes: '',
    terms: 'Net 30',
    discountAmount: discountAmount,
    status: 'DRAFT',
    ...initialData
  };

  const validate = (values: InvoiceFormValues) => {
    const errors: Partial<Record<keyof InvoiceFormValues, string>> = {};
    
    if (!values.customerId) {
      errors.customerId = 'Customer is required';
    }

    if (!values.issueDate) {
      errors.issueDate = 'Issue date is required';
    }

    if (!values.dueDate) {
      errors.dueDate = 'Due date is required';
    }

    // Validate that due date is after issue date
    if (values.issueDate && values.dueDate && new Date(values.dueDate) < new Date(values.issueDate)) {
      errors.dueDate = 'Due date must be after issue date';
    }
    
    if (lineItems.length === 0) {
      // This would be handled separately in the UI
    }
    
    return errors as FormErrors;
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useForm<InvoiceFormValues>({
    initialValues: defaultValues,
    validate,
    onSubmit
  });

  const handleSubmitWithItems = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isValid = validate();
    if (!isValid) return;
    
    // In a real implementation, we would combine form values with line items
    const formData = {
      ...values,
      lineItems,
      subtotal,
      taxAmount,
      discountAmount,
      total
    };
    
    await onSubmit(formData);
  };

  return (
    <>
      {/* Invoice Header */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Customer</label>
          <Select
            value={values.customerId}
            onChange={(e) => handleChange('customerId', e.target.value)}
            onBlur={() => handleBlur('customerId')}
            placeholder="Select a customer"
            className={errors.customerId ? '' : ''}
          />
          {errors.customerId && (
            <p className="mt-1 text-sm text-error">{errors.customerId}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Purchase Order #</label>
          <Input
            value={values.poNumber}
            onChange={(e) => handleChange('poNumber', e.target.value)}
            onBlur={() => handleBlur('poNumber')}
            placeholder="Enter purchase order number (optional)"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Issue Date</label>
          <Input
            type="date"
            value={values.issueDate}
            onChange={(e) => handleChange('issueDate', e.target.value)}
            onBlur={() => handleBlur('issueDate')}
            className={errors.issueDate ? '' : ''}
          />
          {errors.issueDate && (
            <p className="mt-1 text-sm text-error">{errors.issueDate}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Due Date</label>
          <Input
            type="date"
            value={values.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            onBlur={() => handleBlur('dueDate')}
            className={errors.dueDate ? '' : ''}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-error">{errors.dueDate}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-text-muted mb-1">Terms</label>
        <Input
          value={values.terms}
          onChange={(e) => handleChange('terms', e.target.value)}
          onBlur={() => handleBlur('terms')}
          placeholder="Enter payment terms (e.g., Net 30)"
        />
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-text-muted mb-1">Notes / Terms</label>
        <Textarea
          value={values.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          onBlur={() => handleBlur('notes')}
          placeholder="Enter any additional notes or terms"
          rows={3}
        />
      </div>
      
      {/* Line Items Section would go here - typically in a separate component */}
      
      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-surface-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="text-right">
            <span className="text-text-muted">Subtotal:</span>
          </div>
          <div className="text-right">
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="text-right">
            <span className="text-text-muted">Tax (10%):</span>
          </div>
          <div className="text-right">
            <span className="font-medium">$${taxAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="text-right">
            <span className="text-text-muted">Discount:</span>
          </div>
          <div className="text-right">
            <span className="font-medium">-$${discountAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-surface-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-right font-semibold text-lg">
              <span>Total:</span>
            </div>
            <div className="text-right font-semibold text-2xl text-primary-500">
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          variant="secondary" 
          onClick={() => {
            // Go back or cancel logic
          }}
        >
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmitWithItems}
          disabled={isSubmitting || lineItems.length === 0}
        >
          {isSubmitting ? 'Saving Invoice...' : 'Create Invoice'}
        </Button>
      </div>
    </>
  );
};
