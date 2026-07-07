import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CustomerFormValues {
  customerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  billingAddress: string;
  shippingAddress: string;
}

export const CustomerForm = ({
  onSubmit,
  initialData,
  isEditMode = false,
}: {
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: Partial<CustomerFormValues>;
  isEditMode?: boolean;
}) => {
  const defaultValues: CustomerFormValues = {
    customerName: '',
    email: '',
    phone: '',
    gstNumber: '',
    billingAddress: '',
    shippingAddress: '',
    ...initialData,
  };

  const validate = (values: CustomerFormValues) => {
    const errors: Partial<Record<keyof CustomerFormValues, string>> = {};
    if (!values.customerName.trim()) errors.customerName = 'Customer name is required';
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email address is invalid';
    return errors as FormErrors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } =
    useForm<CustomerFormValues>({ initialValues: defaultValues, validate, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Customer Name *</label>
          <Input
            value={values.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            onBlur={() => handleBlur('customerName')}
            placeholder="Enter customer name"
          />
          {errors.customerName && <p className="mt-1 text-sm text-error">{errors.customerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="Enter email address"
          />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Phone</label>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">GST Number</label>
          <Input
            value={values.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
            onBlur={() => handleBlur('gstNumber')}
            placeholder="Enter GST number (optional)"
          />
        </div>
      </div>

      <div className="border-t border-surface-2 pt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Billing Address</h2>
        <Textarea
          value={values.billingAddress}
          onChange={(e) => handleChange('billingAddress', e.target.value)}
          onBlur={() => handleBlur('billingAddress')}
          placeholder="Enter full billing address"
          rows={3}
        />
      </div>

      <div className="border-t border-surface-2 pt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Shipping Address (optional)</h2>
        <Textarea
          value={values.shippingAddress}
          onChange={(e) => handleChange('shippingAddress', e.target.value)}
          onBlur={() => handleBlur('shippingAddress')}
          placeholder="Enter full shipping address (leave blank if same as billing)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {!isEditMode && (
          <Button variant="secondary" onClick={() => resetForm()}>Cancel</Button>
        )}
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};
