import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Matches RegisterCompanyRequest / CompanyDTO from the backend.
// Settings (gstPercentage, invoicePrefix, currency, financialYear) live in the Settings entity — not here.
export interface CompanyFormValues {
  companyName: string;
  gstNumber: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  logoUrl: string;
}

export const CompanyForm = ({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: CompanyFormValues) => Promise<void> | void;
  initialData?: Partial<CompanyFormValues>;
}) => {
  const defaultValues: CompanyFormValues = {
    companyName: '',
    gstNumber: '',
    email: '',
    phone: '',
    address: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
    logoUrl: '',
    ...initialData,
  };

  const validate = (values: CompanyFormValues) => {
    const errors: Partial<Record<keyof CompanyFormValues, string>> = {};
    if (!values.companyName.trim()) errors.companyName = 'Company name is required';
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email address is invalid';
    return errors as Partial<Record<keyof CompanyFormValues, string>>;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useForm<CompanyFormValues>({ initialValues: defaultValues, validate, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Company Name *</label>
          <Input
            value={values.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            onBlur={() => handleBlur('companyName')}
            placeholder="Enter company name"
          />
          {errors.companyName && <p className="mt-1 text-sm text-error">{errors.companyName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">GST Number</label>
          <Input
            value={values.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
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
          />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Phone</label>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Logo URL</label>
          <Input
            value={values.logoUrl}
            onChange={(e) => handleChange('logoUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="border-t border-surface-2 pt-6">
        <label className="block text-sm font-medium text-text-muted mb-1">Address</label>
        <Textarea
          value={values.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Enter full company address"
          rows={3}
        />
      </div>

      <div className="border-t border-surface-2 pt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Bank Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Bank Name</label>
            <Input
              value={values.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              placeholder="Enter bank name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Account Number</label>
            <Input
              value={values.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">IFSC Code</label>
            <Input
              value={values.ifsc}
              onChange={(e) => handleChange('ifsc', e.target.value)}
              placeholder="e.g. SBIN0000123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">UPI ID</label>
            <Input
              value={values.upiId}
              onChange={(e) => handleChange('upiId', e.target.value)}
              placeholder="e.g. company@sbi"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Company'}
        </Button>
      </div>
    </form>
  );
};
