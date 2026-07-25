import { useState } from 'react';
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

  const [logoError, setLogoError] = useState('');

  const handleLogoFile = (file: File | undefined) => {
    setLogoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setLogoError('Please choose an image file.'); return; }
    if (file.size > 500 * 1024) { setLogoError('Image must be under 500 KB.'); return; }
    const reader = new FileReader();
    reader.onload = () => handleChange('logoUrl', String(reader.result));
    reader.onerror = () => setLogoError('Could not read that file.');
    reader.readAsDataURL(file);
  };

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

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-text-muted mb-1">Company Logo</label>
          <div className="flex items-start gap-4">
            {values.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.logoUrl}
                alt="Company logo preview"
                className="h-16 w-16 rounded-lg object-contain"
                style={{ background: 'var(--surface-2)', padding: '6px' }}
              />
            )}
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoFile(e.target.files?.[0])}
                className="block w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-3 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text-primary hover:file:bg-surface-4"
              />
              <Input
                value={values.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="…or paste an image URL"
              />
              {values.logoUrl && (
                <button
                  type="button"
                  onClick={() => handleChange('logoUrl', '')}
                  className="text-xs text-text-muted hover:text-error"
                >
                  Remove logo
                </button>
              )}
              {logoError && <p className="text-sm text-error">{logoError}</p>}
              <p className="text-xs text-text-muted">PNG or JPG, under 500 KB. Shown on invoices.</p>
            </div>
          </div>
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
