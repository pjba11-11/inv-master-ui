import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CompanyFormValues {
  name: string;
  gstNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  currency: string;
  taxPercentage: number;
  invoicePrefix: string;
}

export const CompanyForm = ({ 
  onSubmit, 
  initialData 
}: {
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: Partial<CompanyFormValues>;
}) => {
  const defaultValues: CompanyFormValues = {
    name: '',
    gstNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    currency: 'USD',
    taxPercentage: 0,
    invoicePrefix: 'INV',
    ...initialData
  };

  const validate = (values: CompanyFormValues) => {
    const errors: Partial<Record<keyof CompanyFormValues, string>> = {};
    
    if (!values.name.trim()) {
      errors.name = 'Company name is required';
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!values.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!values.city.trim()) {
      errors.city = 'City is required';
    }

    if (!values.state.trim()) {
      errors.state = 'State is required';
    }

    if (!values.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }

    if (!values.country.trim()) {
      errors.country = 'Country is required';
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
  } = useForm<CompanyFormValues>({
    initialValues: defaultValues,
    validate,
    onSubmit
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Company Name</label>
          <Input
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Enter company name"
            className={errors.name ? '' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">GST Number</label>
          <Input
            value={values.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
            onBlur={() => handleBlur('gstNumber')}
            placeholder="Enter GST number"
          />
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
          <label className="block text-sm font-medium text-text-muted mb-1">Address</label>
          <Input
            value={values.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            placeholder="Enter street address"
            className={errors.address ? '' : ''}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-error">{errors.address}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">City</label>
          <Input
            value={values.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            placeholder="Enter city"
            className={errors.city ? '' : ''}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-error">{errors.city}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">State/Province</label>
          <Input
            value={values.state}
            onChange={(e) => handleChange('state', e.target.value)}
            onBlur={() => handleBlur('state')}
            placeholder="Enter state or province"
            className={errors.state ? '' : ''}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-error">{errors.state}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Postal Code</label>
          <Input
            value={values.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            onBlur={() => handleBlur('postalCode')}
            placeholder="Enter postal code"
            className={errors.postalCode ? '' : ''}
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-error">{errors.postalCode}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Country</label>
          <Input
            value={values.country}
            onChange={(e) => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
            placeholder="Enter country"
            className={errors.country ? '' : ''}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-error">{errors.country}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Currency</label>
          <Select
            value={values.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            options={[
              { value: 'USD', label: 'US Dollar ($)' },
              { value: 'EUR', label: 'Euro (€)' },
              { value: 'GBP', label: 'British Pound (£)' },
              { value: 'JPY', label: 'Japanese Yen (¥)' },
              { value: 'CAD', label: 'Canadian Dollar (C$)' },
              { value: 'AUD', label: 'Australian Dollar (A$)' },
              { value: 'INR', label: 'Indian Rupee (₹)' }
            ]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Tax Percentage (%)</label>
          <Input
            type="number"
            value={values.taxPercentage.toString()}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              handleChange('taxPercentage', value);
            }}
            onBlur={() => handleBlur('taxPercentage')}
            placeholder="Enter tax percentage"
            className={errors.taxPercentage ? '' : ''}
          />
          {errors.taxPercentage && (
            <p className="mt-1 text-sm text-error">{errors.taxPercentage}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Invoice Prefix</label>
          <Input
            value={values.invoicePrefix}
            onChange={(e) => handleChange('invoicePrefix', e.target.value)}
            onBlur={() => handleBlur('invoicePrefix')}
            placeholder="Enter invoice prefix (e.g., INV)"
            className={errors.invoicePrefix ? '' : ''}
          />
          {errors.invoicePrefix && (
            <p className="mt-1 text-sm text-error">{errors.invoicePrefix}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          variant="secondary" 
          onClick={() => {
            // Reset form logic would go here
          }}
        >
          Reset
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Company'}
        </Button>
      </div>
    </form>
  );
};
