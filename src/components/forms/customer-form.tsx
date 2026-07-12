import { useForm, FormErrors } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CustomerFormValues {
  customerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  address: string;
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
    address: '',
    ...initialData,
  };

  const validate = (values: CustomerFormValues) => {
    const errors: Partial<Record<keyof CustomerFormValues, string>> = {};
    if (!values.customerName.trim()) errors.customerName = 'Customer name is required';
    if (!values.phone.trim()) errors.phone = 'Phone number is required';
    if (!values.address.trim()) errors.address = 'Billing address is required';
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Invalid email address';
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
          <label className="block text-sm font-medium text-text-muted mb-1">Phone *</label>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
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
          <label className="block text-sm font-medium text-text-muted mb-1">GST Number (GSTIN)</label>
          <Input
            value={values.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
            onBlur={() => handleBlur('gstNumber')}
            placeholder="e.g. 29ABCDE1234F1Z5"
          />
        </div>
      </div>

      <div className="border-t border-surface-2 pt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Billing Address *</h2>
        <Textarea
          value={values.address}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
          placeholder="Enter full billing address"
          rows={3}
        />
        {errors.address && <p className="mt-1 text-sm text-error">{errors.address}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {!isEditMode && (
          <Button variant="secondary" type="button" onClick={() => resetForm()}>Cancel</Button>
        )}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};
