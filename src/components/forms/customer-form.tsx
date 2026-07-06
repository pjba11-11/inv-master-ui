import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  isActive: boolean;
}

export const CustomerForm = ({ 
  onSubmit, 
  initialData,
  isEditMode = false
}: {
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: Partial<CustomerFormValues>;
  isEditMode?: boolean;
}) => {
  const defaultValues: CustomerFormValues = {
    name: '',
    email: '',
    phone: '',
    gstNumber: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: '',
    isActive: true,
    ...initialData
  };

  const validate = (values: CustomerFormValues) => {
    const errors: Partial<Record<keyof CustomerFormValues, string>> = {};
    
    if (!values.name.trim()) {
      errors.name = 'Customer name is required';
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!values.billingAddress.trim()) {
      errors.billingAddress = 'Billing address is required';
    }

    if (!values.billingCity.trim()) {
      errors.billingCity = 'Billing city is required';
    }

    if (!values.billingState.trim()) {
      errors.billingState = 'Billing state is required';
    }

    if (!values.billingPostalCode.trim()) {
      errors.billingPostalCode = 'Billing postal code is required';
    }

    if (!values.billingCountry.trim()) {
      errors.billingCountry = 'Billing country is required';
    }
    
    return errors as FormErrors;
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm
  } = useForm<CustomerFormValues>({
    initialValues: defaultValues,
    validate,
    onSubmit
  });

  const handleCopyBillingToShipping = () => {
    // Copy billing address to shipping address
    // Implementation would update the form values
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Customer Name</label>
          <Input
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Enter customer name"
            className={errors.name ? '' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="Enter email address"
            className={errors.email ? '' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Phone</label>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="Enter phone number"
            className={errors.phone ? '' : ''}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error">{errors.phone}</p>
          )}
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
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Is Active</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-text-muted">Active customer</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-surface-2 pt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Billing Address</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Address</label>
            <Input
              value={values.billingAddress}
              onChange={(e) => handleChange('billingAddress', e.target.value)}
              onBlur={() => handleBlur('billingAddress')}
              placeholder="Enter billing address"
              className={errors.billingAddress ? '' : ''}
            />
            {errors.billingAddress && (
              <p className="mt-1 text-sm text-error">{errors.billingAddress}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">City</label>
            <Input
              value={values.billingCity}
              onChange={(e) => handleChange('billingCity', e.target.value)}
              onBlur={() => handleBlur('billingCity')}
              placeholder="Enter city"
              className={errors.billingCity ? '' : ''}
            />
            {errors.billingCity && (
              <p className="mt-1 text-sm text-error">{errors.billingCity}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">State/Province</label>
            <Input
              value={values.billingState}
              onChange={(e) => handleChange('billingState', e.target.value)}
              onBlur={() => handleBlur('billingState')}
              placeholder="Enter state or province"
              className={errors.billingState ? '' : ''}
            />
            {errors.billingState && (
              <p className="mt-1 text-sm text-error">{errors.billingState}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Postal Code</label>
            <Input
              value={values.billingPostalCode}
              onChange={(e) => handleChange('billingPostalCode', e.target.value)}
              onBlur={() => handleBlur('billingPostalCode')}
              placeholder="Enter postal code"
              className={errors.billingPostalCode ? '' : ''}
            />
            {errors.billingPostalCode && (
              <p className="mt-1 text-sm text-error">{errors.billingPostalCode}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Country</label>
            <Input
              value={values.billingCountry}
              onChange={(e) => handleChange('billingCountry', e.target.value)}
              onBlur={() => handleBlur('billingCountry')}
              placeholder="Enter country"
              className={errors.billingCountry ? '' : ''}
            />
            {errors.billingCountry && (
              <p className="mt-1 text-sm text-error">{errors.billingCountry}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-surface-2 pt-6">
        <div className="flex items-start mb-4">
          <div className="flex items-center h-4 w-4 shrink-0">
            <input
              type="checkbox"
              id="copy-address"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <label htmlFor="copy-address" className="ml-3 text-text-medium">
            Copy billing address to shipping address
          </label>
        </div>
        
        <h2 className="text-lg font-semibold text-text-primary mb-4">Shipping Address (optional)</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Address</label>
            <Input
              value={values.shippingAddress || ''}
              onChange={(e) => handleChange('shippingAddress', e.target.value)}
              onBlur={() => handleBlur('shippingAddress')}
              placeholder="Enter shipping address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">City</label>
            <Input
              value={values.shippingCity || ''}
              onChange={(e) => handleChange('shippingCity', e.target.value)}
              onBlur={() => handleBlur('shippingCity')}
              placeholder="Enter city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">State/Province</label>
            <Input
              value={values.shippingState || ''}
              onChange={(e) => handleChange('shippingState', e.target.value)}
              onBlur={() => handleBlur('shippingState')}
              placeholder="Enter state or province"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Postal Code</label>
            <Input
              value={values.shippingPostalCode || ''}
              onChange={(e) => handleChange('shippingPostalCode', e.target.value)}
              onBlur={() => handleBlur('shippingPostalCode')}
              placeholder="Enter postal code"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Country</label>
            <Input
              value={values.shippingCountry || ''}
              onChange={(e) => handleChange('shippingCountry', e.target.value)}
              onBlur={() => handleBlur('shippingCountry')}
              placeholder="Enter country"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        {!isEditMode && (
          <Button 
            variant="secondary" 
            onClick={() => resetForm()}
          >
            Cancel
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};
